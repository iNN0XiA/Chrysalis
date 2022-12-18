const { supportServer } = require("../../../config.json");
const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "support",
  description: "Join the discord support server",
  category: "utility",
  execute(bot, interaction) {
    const embed = bot.say.baseEmbed(interaction)
      .setDescription(`[Click to join the support server.](${supportServer})`);

    const row = new MessageActionRow().addComponents([
      new MessageButton()
      .setLabel("LAND OF THE FIRE")
            .setStyle("https://discord.gg/vVBfGFt5Ev")
      .setURL(`${supportServer}`)
    ]);


    return interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
  }
};