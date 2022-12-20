//=====================================| Import the Module |=====================================\\
const { Client, ChatInputCommandInteraction } = require("discord.js");

//===============< FUNCTIONS >===============\\
const { errorCmdLogsModal } = require("../../Structures/Functions/errorCmdLogs.js");

//===============< SETTINGS >===============\\
const Webhook = require("../../Structures/Settings/webhook.json");
const Config = require("../../Structures/Settings/config.json");
const Emoji = require("../../Structures/Settings/emojis.json");
const Embed = require("../../Structures/Settings/embed.json");

//===============< OTHERS >===============\\
const color = require("colors");

//=====================================| Code |=====================================\\
module.exports = {
    name: "interactionCreate",

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {
        if (interaction.isModalSubmit()) {
            if (interaction.user.bot) return;
            const command = client.modalForms.get(interaction.customId);
            if (!command) {
                interaction.reply({
                    ephemeral: true,
                    content: "Failed to show modal!"
                });
            };

            //===============< EXECUTE CMD >===============\\
            try {
                command.execute(client, interaction);
            } catch (error) {
                errorCmdLogsModal(client, interaction, error)
                console.log(`${color.bold.red(`[INTERACTION > MODAL: ERROR]`)} ` + `${error}`.bgRed);
            };
        };
    }
};