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

const { PermissionsBitField } = require('discord.js');
const welcomeCard = require('../utils/canvas/welcomeCard.js');
const mention2id = require('../utils/mention2id.js');
const reply = require('../utils/reply.js');

module.exports = {
  name: 'welcome',
  alias: ['welcome-card','welcome-image','greeting','greeting-image','greeting-card'],
  admin: true,
  run: async (client, message, command, args, lang, guildInfo) => {

    if (!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.AttachFiles)) return reply(message, {content:lang.attach_files_permission_missing}, true);

    let welcome = guildInfo.modules.find((c) => c.name == 'welcome');
    await welcomeCard(
      lang,
      welcome.background,
      message.channel,
      await args[0] ? await client.users.fetch(mention2id(args[0])).catch(r=>{}) : null || message.member.user,
      welcome.message || 'default',
      message.author ? null : message
    );

  }
}
