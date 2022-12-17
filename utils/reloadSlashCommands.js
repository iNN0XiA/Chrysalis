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
