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

const mention2id = require('../utils/mention2id.js');
const reply = require('../utils/reply.js');

module.exports = {
  name: 'avatar',
  alias: ['pfp'],
  run: async (client, message, command, args, lang, guildInfo) => {

    let taggedUser = mention2id(args[0]) || message.member.user.id;
    try {
      taggedUser = await message.guild.members.fetch(taggedUser)
    } catch (e) {
      try {
        taggedUser = await client.users.fetch(taggedUser);
      } catch (e) {
        return reply(message, {content:lang.couldn_t_find_that_user}, true)
      }
    }


    // If tagged user is Chrysalis, send profile picture artwork source
      if (taggedUser.id == client.user.id) return reply(message, 'https://i.imgur.com/f6lBq3g.png');

    return reply(message, {embeds:[{
      title: lang.avatar.replace('{0}', taggedUser.nickname || taggedUser.username),
      image: { url: taggedUser.displayAvatarURL({size:4096}) },
      color: taggedUser.displayColor || guildInfo.color
    }]});

  }
}
