const { Client, GatewayIntentBits, Collection, EmbedBuilder, PermissionsBitField, OAuth2Scopes, resolveColor } = require('discord.js');
const presence = require('./presence.js');
const client = new Client({
	failIfNotExists: false,
	presence: presence,
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildBans,
		GatewayIntentBits.DirectMessages
	]
});
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const reloadSlashCommands = require('./utils/reloadSlashCommands.js');
const announceLevelUp = require('./utils/embed/announceLevelUp.js');
const boostEmbed = require('./utils/embed/boostEmbed.js');
const connectToDatabase = require('./utils/connectToDatabase.js');
const defaultModules = require('./defaultModules.js');
const onCooldown = new Set();
const inVoiceChat = new Set();
const banned = new Set();

client.on('ready', async () => {
	console.log(highlight(`Bot started as ${client.user.tag}`));
	await registerCommands();
	setInterval((() => { client.user.setPresence(presence); }), 1800000); // Refresh presence every half an hour so it doesn't vanish
	let totalMembers = 0;
	for (guild of client.guilds.cache.values()) totalMembers+=guild.memberCount;
	console.log(highlight(`${client.user.username} is ready on ${client.guilds.cache.size} server${client.guilds.cache.size !== 1 ? 's' : ''} with a total of ${totalMembers} members!`));
});

client.on('guildCreate', (guild) => {
	console.log(`Client joined guild ${guild.name} with ID ${guild.id}`);
	createGuild(guild, true);
});

client.on('messageCreate', async (message) => {

	if (!message.guild || message.author.bot) return; // Ignore DMs and bots

	let guildInfo = await getGuildInfo(message.guild);

	// Send help if bot is tagged
	if (message.content == `<@!${client.user.id}>` || message.content == `<@${client.user.id}>`) await botInfo(message, guildInfo);

	// Blocked / Banned Words
	if (await bannedWords(message, guildInfo)) return;

	// Run command and add XP
	runTextCommand(message, guildInfo);

	// Check the suggestions channel (if enabled)
	checkSuggestion(message, guildInfo.modules);

});

client.on('messageUpdate', async (oldMessage, newMessage) => {
	if (newMessage.guild) {
		sendEditedMessage(oldMessage, newMessage);
		bannedWords(newMessage, await getGuildInfo(newMessage.guild));
	}
});

client.on('messageDelete', async (message) => {
	if (message.author.id == client.user.id) return;
	if (message.guild) sendDeletedMessage(message);
});

client.on('guildMemberAdd', async (member) => {
	let guildInfo = await getGuildInfo(member.guild);
	let lang = require(`./lang/${guildInfo.lang}.js`);
	let welcome = guildInfo.modules.find((c) => c.name == 'welcome');
	if (!welcome.enabled || !welcome.channel) return;
	let channel = await member.guild.channels.fetch(welcome.channel).catch(r=>{});
	if (!channel) return;
	if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ViewChannel)) return;
	if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
	if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.AttachFiles)) return;
	const welcomeCard = require('./utils/canvas/welcomeCard.js');
	welcomeCard(lang, welcome.background, channel, member.user, welcome.message || 'default');
});

client.on('guildMemberRemove', async (member) => {
	let isBan = banned.has(member.user.id);
	if (isBan) banned.delete(member.user.id);
	let guildInfo = await getGuildInfo(member.guild);
	let goodbye = guildInfo.modules.find((c) => c.name == 'goodbye');
	if (!goodbye.enabled) return;
	let channel = await member.guild.channels.fetch(goodbye.channel).catch(r=>{});
	if (!channel) return;
	let lang = require(`./lang/${guildInfo.lang}.js`);
	goodbye.message ||= 'default';
	if (goodbye.message == 'default') goodbye.message = lang.defaultValues.goodbye.message;
	goodbye.banMessage ||= 'default';
	if (goodbye.banMessage == 'default') goodbye.banMessage = lang.defaultValues.goodbye.banMessage;
	if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ViewChannel)) return;
	if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
	let message = isBan ? goodbye.banMessage : goodbye.message;
	channel.send(message.replaceAll('{user}',member.user.tag).replaceAll('{guild}',member.guild.name)).catch(r=>{});
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	// New booster
	if (!oldMember.premiumSince && newMember.premiumSince) boostEmbed(newMember, await getGuildInfo(newMember.guild));
	// Renewing boost
	if (oldMember.premiumSince && oldMember.premiumSinceTimestamp != newMember.premiumSinceTimestamp) boostEmbed(newMember, await getGuildInfo(newMember.guild));
});

client.on('guildBanAdd', async (ban) => {
	if (!banned.has(ban.user.id)) banned.add(ban.user.id);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
	if (newState.member.user.bot) return;
	if ((newState.channel?.id && !oldState.channel?.id) || (newState.channel?.guild?.id && oldState.channel?.guild?.id != newState.channel?.guild?.id)) {
		// User joins a voice channel (not switch)
		inVoiceChat.add(`${newState.member.user.id},${newState.guild.id};${new Date()}`);
	}
	if ((oldState.channel?.id && !newState.channel?.id) || (oldState.channel?.guild?.id && oldState.channel?.guild?.id != newState.channel?.guild?.id)) {
		// User leaves a voice channel
		addVoiceXP(oldState);
	}
});

client.on('interactionCreate', async (i) => {
	if (i.isChatInputCommand()) return runSlashCommand(i);
	if (!i.isButton()) return;
	if (!i.guild) return i.deferUpdate();

	// Role menu
	if (i.customId.startsWith('role-')) {
		try { await i.deferUpdate(); } catch (e) { return; }
		let roleID = i.customId.replace('role-', '');
		await i.member.fetch(true);
		try {
			if (!i.member.roles.cache.get(roleID)) await i.member.roles.add(roleID);
			else await i.member.roles.remove(roleID);
		} catch (e) {
			let guildInfo = await getGuildInfo(i.guild);
			let lang = require(`./lang/${guildInfo.lang}.js`);
			if (!i.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) await i.followUp({ content:lang.manage_roles_permission_required, ephemeral:true }).catch(r=>{});
			else if (i.guild.members.me.roles.highest.position < i.guild.roles.cache.get(roleID).position) await i.followUp({ content:lang.chrysalis_role_too_low, ephemeral:true }).catch(r=>{});
			else await i.followUp({ content: lang.roles_managed_by_integrations_cannot_be_manually_assigned, ephemeral: true }).catch(r=>{});
		}
	}

	// Delete inappropriate images
	if (i.customId.startsWith('report')) {
		try { await i.deferReply({ephemeral:true}); } catch(e) { return; }
		let args = i.customId.split('-');
		let reportURL = args[1];
		let commandMessage = args[2];
		let guildInfo = await getGuildInfo(i.guild);
		let lang = require(`./lang/${guildInfo.lang}.js`);
		await i.editReply({embeds:[{
			title: lang.please_report,
			url: reportURL,
			color: guildInfo.color
		}]});
		try {
			i.message.delete();
			if (commandMessage) await i.channel.messages.fetch({ message: commandMessage, cache: false }).then(m => m.delete());
		} catch (e) {}
	}
});

client.login(process.env.DISCORD_TOKEN);

async function isRestricted(command, message, modules) {
	let cmdModule = modules.find((c) => c.name == command) || modules.find(c=>c.name==client.commands.get(command)?.dependsOn);
	if (!cmdModule.enabled) return 'disabled';
	if (cmdModule.restricted) return (cmdModule.allowedChannels.indexOf(message.channel.id) == -1);
	else return false;
}

async function runTextCommand(message, guildInfo) {

	if (!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
	if (message.content.startsWith(guildInfo.prefix)) {
		let args = message.content.slice(guildInfo.prefix.length).split(' ');
		let command = args.shift().toLowerCase();
		let cmd = client.commands.get(command) || client.commands.find((c) => c.alias.includes(command));
		if (cmd) {
			let lang = require(`./lang/${guildInfo.lang}.js`);
			if (cmd.nsfw && !message.channel.nsfw) return message.author.send(lang.nsfw_only).catch(r=>{});
			let restricted = false;
			if (!cmd.admin) restricted = await isRestricted(cmd.name, message, guildInfo.modules);
			else if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
			if (restricted) return restricted === 'disabled' ? null : message.author.send(lang.wrong_channel).catch(r=>{/*User blocked Chrysalis*/});
			if (cmd.name!='clean') await message.channel.sendTyping().catch(r=>{});
			cmd.run(client, message, command, args, lang, guildInfo);
    }
	} else if (guildInfo.modules.find(m => m.name == 'rank').enabled) await addMessageXP(message, guildInfo);
}

async function runSlashCommand(i) {

	let guildInfo = await getGuildInfo(i.guild);
	if (!i.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages) || !i.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ViewChannel)) return;
	let lang = require(`./lang/${guildInfo.lang}.js`);

	let command = i.commandName;
	let args = i.options.data.map(d => d.value);
	let cmd = client.commands.get(command) || client.commands.find((c) => c.alias.includes(command));
	if (cmd) {
		if (cmd.nsfw && !i.channel.nsfw) return i.reply({content:lang.nsfw_only,ephemeral:true});
		let restricted = false;
		if (!cmd.admin) restricted = await isRestricted(command, i, guildInfo.modules);
		else if (!i.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
		if (restricted) return i.reply({content:lang.wrong_channel,ephemeral:true}).catch(r=>{});
		else {
			if (!cmd.modal) try { await i.deferReply({ephemeral:cmd.ephemeral}); } catch (e) { return; }
			cmd.run(client, i, command, args, lang, guildInfo);
		}
	}
}

async function registerCommands() {
	client.commands = new Collection();
	let commands = fs.readdirSync(path.resolve(__dirname, 'commands')).filter((f) => f.endsWith('.js'));
	for (let jsfile of commands) {
		let commandfile = require(`./commands/${jsfile}`);
		client.commands.set(commandfile.name, commandfile);
		console.log(`${jsfile} loaded`);
	}
	for (let guild of client.guilds.cache.values()) {
		let guildInfo = await getGuildInfo(guild);
		await reloadSlashCommands(client, guild, guildInfo);
	}
}

async function bannedWords(message, guildInfo) {

	if (message.author.id == client.user.id) return;
	if (!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ManageMessages)) return;
	let bannedwords = guildInfo.modules.find((c) => c.name == 'bannedwords');
	if (!bannedwords.enabled) return false;
	if (message.member && message.member.permissions.has(PermissionsBitField.Flags.Administrator) && bannedwords.ignoreAdmins) return;
	let lang = require(`./lang/${guildInfo.lang}.js`);
	for (let word of bannedwords.words) {
		if (message.content.toLowerCase().includes(word.toLowerCase())) {
			try {
				await message.delete();
				if (message.member && bannedwords.sendMessageOnDelete) await message.author.send(bannedwords.message == 'default' ? lang.defaultValues.bannedwords.message : bannedwords.message).catch(r=>{});
			} catch (e) {} finally {
				return true;
			}
		}
		if (message.attachments.size>0) {
			for (let word of bannedwords.words) {
				for (let attachment of message.attachments.values()) {
					if (attachment.name.toLowerCase().includes(word.toLowerCase())) {
						try {
							await message.delete();
							if (message.member && bannedwords.sendMessageOnDelete) await message.author.send(bannedwords.message == 'default' ? lang.defaultValues.bannedwords.message : bannedwords.message).catch(r=>{});
						} catch (e) {} finally {
							return true;
						}
					}
				}
			}
		}
	}
	return !message.member;
}

async function botInfo(message, guildInfo) {
	if (!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
	let lang = require(`./lang/${guildInfo.lang}.js`);
	const invite = client.generateInvite({
		permissions: [
			PermissionsBitField.Flags.Administrator
		],
		scopes: [
			OAuth2Scopes.Bot,
			OAuth2Scopes.ApplicationsCommands
		]
	});
	message.channel.send({embeds:[{
		title: client.user.username,
		description: `[${lang.invite_the_bot}](${invite}) | [${lang.website}](https://chrysalis.programmerpony.com) | [${lang.support_server}](https://discord.gg/Vj2jYQKaJP)`,
		thumbnail: { url: client.user.displayAvatarURL() },
		color: guildInfo.color,
		fields: [
			{
				name: `💻 ${lang.source_code}`,
				value: `[Codeberg (iNN0XiA)](https://github.com/iNN0XiA/Chrysalis)`,
				inline: true
			},
			{
				name: `💞 ${lang.support_the_project}`,
				value: '[Liberapay](https://liberapay.com/iNN0XiA/)',
				inline: true
			}
		],
		footer: {text: lang.the_current_prefix_for_this_server_is(guildInfo.prefix)}
	}]}).catch(r=>{});
}

async function createGuild(guild, rsc) {
	let db = await connectToDatabase();
	let guilds = db.db('chrysalis').collection('guilds');
	if (!(await guilds.findOne({id: guild.id}))) {
		await guilds.insertOne({
			id: guild.id,
			lang: client.commands.get('lang').validLangs.indexOf(guild.preferredLocale.slice(0,2)) >= 0 ? guild.preferredLocale.slice(0,2) : 'en',
			prefix: 'c!',
			color: 0x3e804c,
			modules: defaultModules
		});
		console.log(`Created guild ${guild.name} with ID ${guild.id}`);
	}
	db.close();
	if (rsc) await reloadSlashCommands(client, guild, await getGuildInfo(guild));
}

async function checkSuggestion(message, modules) {
	let suggestions = modules.find((c) => c.name == 'suggestions');
	if (suggestions.enabled && message.channel.id == suggestions.channel)
	if (suggestions.reactToLinks && (message.content.includes('http://') || message.content.includes('https://')) || suggestions.reactToFiles && message.attachments.size>0) {
		await message.react(suggestions.approvalEmoji).catch(r=>{});
		await message.react(suggestions.disapprovalEmoji).catch(r=>{});
	}
}

async function sendDeletedMessage(message) {
	let guildInfo = await getGuildInfo(message.guild);
	let logs = guildInfo.modules.find((c) => c.name == 'logs');
	if (logs.enabled && logs.logDeletedMessages && logs.channel) {

		let channel = await message.guild.channels.fetch(logs.channel).catch(r=>{});
		if (!channel) return;
		let lang = require(`./lang/${guildInfo.lang}.js`);

		let embed = new EmbedBuilder({
			title: lang.message_deleted,
			author: { name: message.author.tag, iconURL: message.author.displayAvatarURL() },
			color: guildInfo.color,
			fields: [
				{
					name: lang.author,
					value: `<@!${message.author.id}>`
				}
			]
		});

		if (message.content)
		embed.addFields({name: lang.message, value: message.content.slice(0,1024)});

		if (message.attachments.size>0)
		embed.addFields({name: lang.attachments, value: message.attachments.map(a => a.name).join('\n').slice(0,1024)});

		embed.addFields([
			{ name: lang.message_id, value: message.id },
			{ name: lang.channel, value: `${message.channel} [${lang.jump_to_moment}](${message.url})`}
		]);

		channel.send({embeds:[embed]}).catch(r=>{});
	}
}

async function sendEditedMessage(oldMessage, newMessage) {

	if (oldMessage.attachments.size == newMessage.attachments.size && oldMessage.content == newMessage.content) return;
	if (newMessage.author.id == client.user.id) return;
	let guildInfo = await getGuildInfo(newMessage.guild);
	let logs = guildInfo.modules.find((c) => c.name == 'logs');
	if (logs.enabled && logs.logEditedMessages && logs.channel) {

		let channel = await newMessage.guild.channels.fetch(logs.channel);
		if (!channel) return;
		let lang = require(`./lang/${guildInfo.lang}.js`);

		let embed = new EmbedBuilder({
			title: lang.message_edited,
			author: {
				name: newMessage.author.tag,
				iconURL: newMessage.author.displayAvatarURL()
			},
			color: guildInfo.color,
			fields: [{name: lang.author, value: `<@!${newMessage.author.id}>`}]
		});

		if (oldMessage.content != newMessage.content) {
			if (oldMessage.content) embed.addFields({name: lang.old_message, value: oldMessage.content.slice(0,1024)});
			if (newMessage.content) embed.addFields({name: lang.new_message, value: newMessage.content.slice(0,1024)});
		}

		if (oldMessage.attachments.size>0 && oldMessage.attachments.size != newMessage.attachments.size) {
			embed.addFields({name: lang.old_attachments, value: oldMessage.attachments.map(a => a.name).join('\n').slice(0,1024)});
			if (newMessage.attachments.size>0) embed.addFields({name: lang.new_attachments, value:oldMessage.attachments.map(a => a.name).join('\n').slice(0,1024)});
		}

		embed.addFields([
			{ name: lang.message_id, value: newMessage.id },
			{ name: lang.channel, value: `${newMessage.channel} [${lang.jump_to_moment}](${newMessage.url})` }
		]);

		channel.send({embeds:[embed]}).catch(r=>{});
	}
}

async function addMessageXP(message, guildInfo) {

	if (onCooldown.has(`${message.author.id},${message.guild.id}`)) return;
	let rank = guildInfo.modules.find((c) => c.name == 'rank');
	if (!rank.enabled) return;
	if (rank.xpBlacklistChannels.indexOf(message.channel.id) != -1) return;
	if (rank.xpPerMessage <= 0) return;
	let user = rank.users.find(u => u.id == message.author.id);
	if (user?.xp >= Number.MAX_SAFE_INTEGER) return;

	let db = await connectToDatabase();
	let guilds = db.db('chrysalis').collection('guilds');
	let guild = await guilds.findOne({id: message.guild.id});
	let modules = guild.modules;
	rank = modules.find((c) => c.name == 'rank');
	user = rank.users.find(u => u.id == message.author.id);
	if (!user) user = rank.users[rank.users.push({id: message.author.id, xp: 0})-1];

	let currentLevel = Math.trunc((Math.sqrt(5)/5)*Math.sqrt(user.xp));

	user.xp+=rank.xpPerMessage;

	let newLevel = Math.trunc((Math.sqrt(5)/5)*Math.sqrt(user.xp));

	if (!isNaN(parseInt(user.xp))) {
		await guilds.updateOne({id: message.guild.id},{ $set: { modules: modules}});
		if ((currentLevel < newLevel) && rank.announceLevelUp)
		announceLevelUp(
			client,
			message.author,
			newLevel,
			rank.announceLevelUpChannel,
			guild.color,
			require(`./lang/${guild.lang}.js`)
		);
	}
	db.close();
	if (rank.messageCooldown > 0) {
		onCooldown.add(`${message.author.id},${message.guild.id}`);
		setTimeout(() => {
			onCooldown.delete(`${message.author.id},${message.guild.id}`);
		}, rank.messageCooldown*1000);
	}
}

async function addVoiceXP(state) {

	let guildInfo = await getGuildInfo(state.guild);
	let rank = guildInfo.modules.find((c) => c.name == 'rank');
	if (!rank.enabled) return;
	if (rank.xpBlacklistChannels.indexOf(state.channel.id) != -1) return;
	if (rank.voiceChatCooldown <= 0 || rank.xpInVoiceChat <= 0) return;
	let user = rank.users.find(u => u.id == state.member.user.id);
	if (user?.xp >= Number.MAX_SAFE_INTEGER) return;

	let ivc = Array.from(inVoiceChat).find(e=>e.startsWith(`${state.member.user.id},${state.guild.id};`));
	if (inVoiceChat.delete(ivc)) {
		let db = await connectToDatabase();
		let guilds = db.db('chrysalis').collection('guilds');
		let guild = await guilds.findOne({id: state.guild.id});
		let modules = guild.modules;
		rank = modules.find((c) => c.name == 'rank');
		user = rank.users.find(u => u.id == state.member.user.id);
		if (!user) user = rank.users[rank.users.push({id: state.member.user.id, xp: 0})-1];
		let currentLevel = Math.trunc((Math.sqrt(5)/5)*Math.sqrt(user.xp));

		let timestamp = new Date(ivc.slice(ivc.indexOf(';')+1));
		let secondsInVoiceChat = Math.trunc(Math.abs(new Date() - timestamp)/1000);
		if (secondsInVoiceChat >= rank.voiceChatCooldown) user.xp+=Math.trunc(secondsInVoiceChat/rank.voiceChatCooldown)*rank.xpInVoiceChat;
		let newLevel = Math.trunc((Math.sqrt(5)/5)*Math.sqrt(user.xp));

		if (!isNaN(parseInt(user.xp))) {
			await guilds.updateOne({id: state.guild.id},{ $set: { modules: modules}});
			if ((currentLevel < newLevel) && rank.announceLevelUp)
			announceLevelUp(
				client,
				state.member.user,
				newLevel,
				rank.announceLevelUpChannel,
				guild.color,
				require(`./lang/${guild.lang}.js`)
			);
		}
		db.close();
	}
}

async function getGuildInfo(guild) {
	let db = await connectToDatabase();
	let guilds = db.db('chrysalis').collection('guilds');
	let guildInfo = await guilds.findOne({id: guild.id});
	if (!guildInfo) {
		await createGuild(guild, false);
		guildInfo = await guilds.findOne({id: guild.id});
	}
	// Remove null modules
	guildInfo.modules = guildInfo.modules.filter(m=>m!==null);
	// Add missing modules
	for (let dm of defaultModules) if (!guildInfo.modules.find((m) => m.name == dm.name)) guildInfo.modules.push(dm);
	for (let m of guildInfo.modules) {
		let dm = defaultModules.find((dm) => dm.name == m.name);
		// Remove leftover modules
		if (!dm) {
			delete guildInfo.modules[guildInfo.modules.indexOf(m)];
			guildInfo.modules = guildInfo.modules.filter(m=>m!==null);
			continue;
		}
		let model = JSON.parse(JSON.stringify(dm));
		// Add missing properties and remove leftover properties
		for (let p in m) if (p in model) model[p] = m[p];
		guildInfo.modules[guildInfo.modules.indexOf(m)] = JSON.parse(JSON.stringify(model));
	}
	await guilds.updateOne({id: guild.id},{ $set: { modules: guildInfo.modules, color: resolveColor(guildInfo.color) }});
	db.close();
	return guildInfo;
}

function highlight(s) { return `\u001b[47m\u001b[30m${s}\u001b[49m\u001b[39m`; }
