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

const { ApplicationCommandOptionType } = require('discord.js');
const connectToDatabase = require('../utils/connectToDatabase.js');
const announceLevelUp = require('../utils/embed/announceLevelUp.js');
const mention2id = require('../utils/mention2id.js');
const reply = require('../utils/reply.js');

module.exports = {
  name: 'setxp',
  alias: ['setexperience','setlevel','setlvl'],
  admin: true,
  dependsOn: 'rank',
  run: async (client, message, command, args, lang, guildInfo) => {

    if (!message.author) {
      args[0] = message.options.data.find(o => o.type == ApplicationCommandOptionType.User).value;
      args[1] = message.options.data.find(o => o.type == ApplicationCommandOptionType.Integer).value;
    }

    if (!guildInfo.modules.find((c) => c.name == 'rank')?.enabled) return;

    let newXP = parseInt(args[1]);
    if (isNaN(newXP) || newXP < 0) return reply(message, {content:lang.please_type_a_valid_positive_integer}, true);

    try {
      let taggedUser = await client.users.fetch(mention2id(args[0]) || message.member.user);
      let db = await connectToDatabase();
      let guilds = db.db('chrysalis').collection('guilds');
      let guild = await guilds.findOne({id: message.guild.id});
      let modules = guild.modules;
      let rank = modules.find((c) => c.name == 'rank');
      let user = rank.users.find(u => u.id == taggedUser.id);
      if (!user) {
        rank.users.push({id: taggedUser.id, xp: 0});
        user = rank.users.find(u => u.id == taggedUser.id);
      }
      let currentLevel = Math.trunc((Math.sqrt(5)/5)*Math.sqrt(user.xp));
      user.xp = newXP;
      let newLevel = Math.trunc((Math.sqrt(5)/5)*Math.sqrt(user.xp));
      await guilds.updateOne({id: message.guild.id},{ $set: { modules: modules}});
      db.close();
  
      // Announce level up if new level is higher
      if ((currentLevel < newLevel) && rank.announceLevelUp)
      announceLevelUp(
        client,
        taggedUser,
        newLevel,
        rank.announceLevelUpChannel,
        guildInfo.color,
        lang
      );
  
      // Display new level and XP
      reply(message, {embeds:[{
        title: taggedUser.username,
        description: `${lang.level}: \`${Math.trunc((Math.sqrt(5)/5)*Math.sqrt(newXP))}\`\nXP: \`${newXP}\``,
        color: guildInfo.color,
        thumbnail: { url: taggedUser.displayAvatarURL() }
      }]}, true);
    } catch (error) {
      reply(message, {content:lang.couldn_t_find_that_user}, true);
    }
  }
}
