const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const connectToDatabase = require('../utils/connectToDatabase.js');
const reply = require('../utils/reply.js');
const emojis = require('../emojis.js');

module.exports = {
    name: 'prefix',
    alias: ['setprefix', 'changeprefix', 'prefixset', 'set-prefix', 'change-prefix'],
    admin: true,
    run: async (client, message, command, args, lang, guildInfo) => {

        if (!args[0]) return message.channel.send(lang.the_current_prefix_for_this_server_is(`**${guildInfo.prefix}**`));

        reply(message, {
            content: lang.change_prefix_to(args[0]),
            components: [new ActionRowBuilder().addComponents([
                new ButtonBuilder({
                    customId: `prefix-${args[0]}`,
                    emoji: emojis.PinkiePieYes,
                    style: ButtonStyle.Success
                }),
                new ButtonBuilder({
                    customId: 'prefix-dismiss',
                    emoji: emojis.PinkiePieNo,
                    style: ButtonStyle.Danger
                })
            ])]
        }).then(confMsg => {
            let collector = confMsg.createMessageComponentCollector({ filter: (i) => i.member.id === message.member.id, time: 15_000 });
            collector.on('collect', async (i) => {
                collector.stop(i.customId === 'prefix-dismiss' ? 'time' : 'new prefix!!!');
                if (i.customId === `prefix-${args[0]}`) {
                    let db = await connectToDatabase();
                    let guilds = db.db('chrysalis').collection('guilds');
                    await guilds.updateOne({ id: message.guild.id }, { $set: { prefix: args[0] } });
                    db.close();
                    i.update({ content: lang.prefix_was_changed_to(args[0]), components: [] });
                }
            });
            collector.on('end', (collected, reason) => {
                if (reason == 'time') try {
                    confMsg.delete();
                    message.delete();
                } catch (e) { }
            });
        });
    }
}
