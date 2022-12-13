/*

 Copyright (C) 2022 programmerpony

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/

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
