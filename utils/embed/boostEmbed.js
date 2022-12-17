const { PermissionsBitField } = require("discord.js");

module.exports = async (member, guildInfo, channel, i) => {
	let boost = guildInfo.modules.find((c) => c.name == 'boost');
	if ((boost.enabled && boost.channel) || channel) {
		channel ??= await member.guild.channels.fetch(boost.channel).catch(r=>{});
		if (!channel) return;
		let lang = require(`../../lang/${guildInfo.lang}.js`);
		let message = {
			content: (boost.message !== 'default' ? boost.message : lang.defaultValues.boost.message).replaceAll('{user}',member.user).replaceAll('{boostCount}',member.guild.premiumSubscriptionCount).replaceAll('{tier}',member.guild.premiumTier),
			embeds:[{
				title: (boost.title !== 'default' ? boost.title : lang.defaultValues.boost.title).replaceAll('{user}',member.user.username).replaceAll('{boostCount}',member.guild.premiumSubscriptionCount).replaceAll('{tier}',member.guild.premiumTier),
				description: (boost.description !== 'default' ? boost.description : lang.defaultValues.boost.description).replaceAll('{user}',member.user).replaceAll('{boostCount}',member.guild.premiumSubscriptionCount).replaceAll('{tier}',member.guild.premiumTier),
				thumbnail: { url: member.user.displayAvatarURL({ forceStatic: true, size: 512 }) },
				color: member.guild.roles.premiumSubscriberRole?.color || 0xdb6de2 // Pink
			}]
		};
		if (!channel.permissionsFor(member.client.user.id).has(PermissionsBitField.Flags.EmbedLinks)) message = lang.embed_links_permission_missing;
		return i ? i.editReply(message) : channel.send(message).catch(r=>{});
  }
}
