const { EmbedBuilder, resolveColor, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const connectToDatabase = require('../utils/connectToDatabase.js');
const reply = require('../utils/reply.js');
const emojis = require('../emojis.js');

module.exports = {
  name: 'color',
  alias: ['setcolor','changecolor','set-color','change-color'],
  admin: true,
  run: async (client, message, command, args, lang, guildInfo) => {

    let currentColor = {
      embeds: [{
        title: lang.current_color,
        description: `#${guildInfo.color.toString(16).padStart(6,'0')}`,
        color: guildInfo.color
      }]
    }
    if (!args[0]) return reply(message, currentColor);

    let requestedColor = args[0].replaceAll('#','');
    requestedColor = `#${requestedColor.repeat(6).substring(0,6)}`;
    let embed = new EmbedBuilder().setTitle(lang.change_color_to.replace('{0}', requestedColor));
    try {
      embed.setColor(requestedColor);
    } catch (e) {
      return reply(message, {content:lang.invalid_color}, true);
    }

    let confMsg = await reply(message, {
      embeds:[embed],
      components:[new ActionRowBuilder().addComponents([
        new ButtonBuilder({
          customId: `color-${requestedColor}`,
          emoji: emojis.PinkiePieYes,
          style: ButtonStyle.Success
        }),
        new ButtonBuilder({
          customId: 'color-dismiss',
          emoji: emojis.PinkiePieNo,
          style: ButtonStyle.Danger
        })
      ])]
    });
    let collector = confMsg.createMessageComponentCollector({ filter: (i) => i.member.id === message.member.id, time: 15_000 });
    collector.on('collect', async (i) => {
      collector.stop(i.customId === 'color-dismiss' ? 'time' : 'new color!!!');
      if (i.customId === `color-${requestedColor}`) {
        let db = await connectToDatabase();
        let guilds = db.db('chrysalis').collection('guilds');
        await guilds.updateOne({id: message.guild.id},{ $set: { color: resolveColor(requestedColor)}});
        db.close();
        i.update({embeds:[{
          title: lang.color_was_changed_to.replace('{0}', requestedColor),
          color: resolveColor(requestedColor)
        }],components:[]});
      }
    });
    collector.on('end', (collected, reason) => {
      if (reason == 'time') try {
        confMsg.delete();
        message.delete();
      } catch (e) {}
    });
  }
}
