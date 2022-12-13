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

module.exports = async (client, guild, guildInfo) => {
  let lang = require(`../lang/${guildInfo.lang}.js`);
  let applicationCommands = [];
  for (let command of client.commands.values()) {
    if (command.dependsOn) {
      if (!guildInfo.modules.find((c) => c.name == command.dependsOn).enabled) continue;
    } else if (!command.admin && !guildInfo.modules.find((c) => c.name == command.name).enabled) continue;
    let cmdtxt = lang.commands.user.find((c) => c.name == command.name) || lang.commands.admin.find((c) => c.name == command.name);
    if (!cmdtxt) continue;
    cmdtxt = JSON.parse(JSON.stringify(cmdtxt));
    cmdtxt.default_member_permissions = command.admin ? '0' : cmdtxt.default_member_permissions;
    cmdtxt.description = `${command.admin ? '🛠 ' : ''}${cmdtxt.description}`;
    applicationCommands.push(cmdtxt);
  }

  try {
    await guild.commands.set(applicationCommands);
    console.log(`Successfully (re)loaded slash commands on ${guild.name}`)
  } catch (e) {
    console.log(`Can't load slash commands on ${guild.name}`)
  }
}
