const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'help',
    alias: ['commands', 'ayuda', 'cmds'],
    run: async (client, message, command, args, lang, guildInfo) => {

        let helpEmbed = [];
        let i = 0;
        for (let ch of client.commands.filter(c => !c.admin && c.name != 'help').map(c => c.name)) {
            if (guildInfo.modules.find((c) => c.name == ch)?.enabled || guildInfo.modules.find((c) => c.name == client.commands.get(ch)?.dependsOn)?.enabled) {
                if (helpEmbed[i]?.data.fields.length == 5) i++;
                helpEmbed[i] ??= new EmbedBuilder({ // Create page if it doesn't exist
                    title: `__**${lang.user_commands}**__`,
                    color: guildInfo.color
                });
                ch = lang.commands.user.find(c => c.name === ch);
                helpEmbed[i].addFields({ // Add command to current page
                    name: `\`${guildInfo.prefix}${ch.name}${ch.options?.map(o => ` {${o.name}${o.required ? '' : ` (${lang.optional})`}}`).join('') || ''}\`${(ch.nsfw ? ' ⚠' : '')}`,
                    value: ch.description
                });
            }
        }

        if (helpEmbed.length > 1) {
            let leftButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: '<',
                customId: 'left',
                disabled: true
            });
            let rightButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: '>',
                customId: 'right'
            });
            let sentEmbed = await message.channel.send({ embeds: [helpEmbed[0]], components: [new ActionRowBuilder().addComponents([leftButton, rightButton])] });
            let filter = (interaction) => interaction.user.id === message.author.id;
            let collector = sentEmbed.createMessageComponentCollector({ filter, time: 120000 });
            let currentPage = 0;
            collector.on('collect', async (i) => {
                if (i.customId == 'left') {
                    if (currentPage > 0) currentPage--;
                    leftButton.setDisabled(currentPage == 0);
                    rightButton.setDisabled(false);
                } else {
                    if (currentPage < helpEmbed.length - 1) currentPage++;
                    rightButton.setDisabled(currentPage == helpEmbed.length - 1);
                    leftButton.setDisabled(false);
                }
                try {
                    await i.update({
                        embeds: [helpEmbed[currentPage]],
                        components: [new ActionRowBuilder().addComponents([leftButton, rightButton])]
                    });
                } catch (e) { }
            });
            collector.on('end', async (collected, reason) => {
                if (reason == 'time') {
                    leftButton.setDisabled(true);
                    rightButton.setDisabled(true);
                    try {
                        await sentEmbed.edit({
                            embeds: [helpEmbed[currentPage].setFooter({ text: lang.help_time_out })],
                            components: [new ActionRowBuilder().addComponents([leftButton, rightButton])]
                        });
                    } catch (e) { }
                }
            });
        } else message.channel.send({ embeds: [helpEmbed[0]] });

        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            let adminHelpEmbed = [];
            let i = 0;
            for (let ch of client.commands.filter(c => c.admin).map(c => lang.commands.admin.find(h => h.name === c.name)).filter(e => e !== undefined)) {
                if (adminHelpEmbed[i]?.data.fields.length == 5) i++;
                adminHelpEmbed[i] ??= new EmbedBuilder({ // Create page if it doesn't exist
                    title: `__**${lang.admin_commands}**__`,
                    color: guildInfo.color
                });
                adminHelpEmbed[i].addFields({ // Add command to current page
                    name: `\`${guildInfo.prefix}${ch.name}${ch.options?.map(o => ` {${o.name}${o.required ? '' : ` (${lang.optional})`}}`).join('') || ''}\``,
                    value: ch.description
                });
            }
            let leftButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: '<',
                customId: 'left',
                disabled: true
            });
            let rightButton = new ButtonBuilder({
                style: ButtonStyle.Secondary,
                label: '>',
                customId: 'right'
            });
            let sentEmbed = await message.channel.send({ embeds: [adminHelpEmbed[0]], components: [new ActionRowBuilder().addComponents([leftButton, rightButton])] });
            let filter = (interaction) => interaction.user.id === message.author.id;
            let collector = sentEmbed.createMessageComponentCollector({ filter, time: 120000 });
            let currentPage = 0;
            collector.on('collect', async (i) => {
                if (i.customId == 'left') {
                    if (currentPage > 0) currentPage--;
                    leftButton.setDisabled(currentPage == 0);
                    rightButton.setDisabled(false);
                } else {
                    if (currentPage < adminHelpEmbed.length - 1) currentPage++;
                    rightButton.setDisabled(currentPage == adminHelpEmbed.length - 1);
                    leftButton.setDisabled(false);
                }
                try {
                    await i.update({
                        embeds: [adminHelpEmbed[currentPage]],
                        components: [new ActionRowBuilder().addComponents([leftButton, rightButton])]
                    });
                } catch (e) { }
            });
            collector.on('end', async (collected, reason) => {
                if (reason == 'time') {
                    leftButton.setDisabled(true);
                    rightButton.setDisabled(true);
                    try {
                        await sentEmbed.edit({
                            embeds: [adminHelpEmbed[currentPage].setFooter({ text: lang.help_time_out })],
                            components: [new ActionRowBuilder().addComponents([leftButton, rightButton])]
                        });
                    } catch (e) { }
                }
            });
        }
    }
}