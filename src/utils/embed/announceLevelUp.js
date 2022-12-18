const { PermissionsBitField } = require('discord.js');

module.exports = async (client, user, level, channelID, color, lang) => {
	if (!channelID) return;
	let channel = await client.channels.fetch(channelID).catch(r=>{});
	if (!channel) return;
	if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ViewChannel)) return;
	if (!channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.SendMessages)) return;
	channel.send({content: `${user}`, embeds:[{
		title: user.username,
		description: lang.levelup(level),
		color: color,
		thumbnail: { url: user.displayAvatarURL({ forceStatic: true, size: 512 }) }
	}]}).catch(r=>{});
}
