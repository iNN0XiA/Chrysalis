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
  name: 'love',
  alias: ['amor','lovemeter','ship'],
  run: async (client, message, command, args, lang, guildInfo) => {

    let lovers = message.mentions ? Array.from(message.mentions.members.values()) : [await message.guild.members.fetch(args[0]), await message.guild.members.fetch(args[1])];
    if (!lovers.length) return reply(message, {content:lang.type_one_or_two_users}, true);

    if (!lovers[1]) {
      lovers[1] = lovers[0];
      lovers[0] = message.author;
    }

    if (lovers[0].id == message.member.id && lovers[1].id == message.member.id) return reply(message, lang.self_love);

    let lovePercent = Math.floor(Math.random()*100+1);
    let lovePerTen = Math.floor(lovePercent/10);
    let percentBar = `${'🟥'.repeat(lovePerTen)}${'⬜'.repeat(10-lovePerTen)}`
    let percentMessage = lang.lovemeter_messages[lovePerTen];

    if (lovers.find(l=>l.id===client.user.id) || lovers[1] == lovers[0]) {
      lovePercent = 0;
      percentBar = '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜';
      percentMessage = '...';
    }

    reply(message, {embeds:[{
      title: `${lovers[0].displayName} x ${lovers[1].displayName}`,
      description: `${lovePercent}% ${percentBar}\n${percentMessage}`,
      color: guildInfo.color
    }]});

  }
}
