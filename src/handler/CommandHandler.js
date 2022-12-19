const glob = require("glob");
const chalk = require('chalk')
module.exports = async function loadCommands(bot) {
  const commandFiles = glob.sync("./src/commands/**/*.js");
  const commandFiles = glob.sync("./src/commands/botowner**/*.js");
  const commandFiles = glob.sync("./src/commands/filters**/*.js");
  const commandFiles = glob.sync("./src/commands/music**/*.js");
  const commandFiles = glob.sync("./src/commands/**/player*.js");
  const commandFiles = glob.sync("./src/commands/**/utility*.js");

  bot.logger.info("COMMANDS", `Loading ${commandFiles.length} commands... (This may take a while)`)

  for await (const file of commandFiles) {
    const command = require(`../../${file}`);

    if (!command.name) {
      throw new TypeError(`[ERROR] name is required for commands! (${file})`);
    }

    if (!command.execute) {
      throw new TypeError(
        `[ERROR] execute function is required for commands! (${file})`
      );
    }

    if (!command.category) {
      bot.logger.warn("[COMMANDS]", `${command.name} command will not be shown in the help command because no category is set.`);
    }

    const data = {
      name: command.name,
      description: command?.description ?? "Empty description",
      options: command?.options ?? []
    };

    
    const cmd = bot.application?.commands.cache.find((c) => c.name === command.name);
    if (!cmd) {
      await bot.application?.commands.create(data);
    }

    // debug
    bot.logger.debug(`CMD DEBUG`, `Loaded ${command.name}.js`);

    delete require.cache[require.resolve(`../../${file}`)];
    bot.commands.set(command.name, command);
  }

};
