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

const reply = require('../utils/reply.js');

module.exports = {
  name: 'serverinfo',
  alias: ['server-info','server','si'],
  run: async (client, message, command, args, lang, guildInfo) => {
    let created = Math.trunc(message.guild.createdTimestamp / 1000);
    let icon = message.guild.iconURL({size:1024});
    reply(message, {embeds:[{
      author: {name: message.guild.name, iconURL: icon},
      description: `__**${lang.server_info}**__`,
      color: guildInfo.color,
      thumbnail: { url: icon },
      fields: [
        { name: lang.server_owner, value: `${await message.guild.fetchOwner()}`, inline: true },
        { name: lang.server_id, value: message.guild.id, inline: true },
        { name: lang.member_count, value: `${message.guild.memberCount}`, inline: true },
        { name: lang.roles, value: `${message.guild.roles.cache.size-1}`, inline: true },
        { name: lang.channels, value: `${message.guild.channels.cache.size}`, inline: true },
        { name: lang.server_boosts, value: `${message.guild.premiumSubscriptionCount}`, inline: true },
        { name: lang.date_created, value: `<t:${created}:F> (<t:${created}:R>)`, inline: true }
      ]
    }]});
  }
}
