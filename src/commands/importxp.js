const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const formatLeaderboard = require('../utils/embed/formatLeaderboard.js');
const connectToDatabase = require('../utils/connectToDatabase.js');
const reply = require('../utils/reply.js');
const emojis = require('../emojis.js');
const bots = ['MEE6', 'AmariBot'];

module.exports = {
  name: 'importxp',
  alias: ['importlevels','migratexp','migratelevels','transferxp','transferlevels'],
  admin: true,
  run: async (client, message, command, args, lang, guildInfo) => {

    // Ask which bot to import levels from

    let row = new ActionRowBuilder();
    for (let bot of bots) row.addComponents([new ButtonBuilder({
      label: bot,
      customId: bot,
      style: ButtonStyle.Secondary
    })]);
    let botMessage = await reply(message, {
      content: lang.import_levels_from,
      components: [row]
    }, true);
    let filter = (interaction) => interaction.user.id === message.member.id;
    let collector = botMessage.createMessageComponentCollector({ filter, time: 12_000 });
    collector.on('end', async (collected, reason) => {
      if (reason == 'time') dismiss(message, botMessage);
    });
    collector.on('collect', async (bot) => {
      collector.stop();
      await bot.deferUpdate();

      // Ask how to handle data

      await botMessage.edit({content:lang.xp_migration_adapt, components: [new ActionRowBuilder().addComponents([
        new ButtonBuilder({
          label: lang.import_levels_and_adapt_xp,
          customId: 'levels',
          style: ButtonStyle.Primary
        }),
        new ButtonBuilder({
          label: lang.import_xp_and_adapt_levels,
          customId: 'xp',
          style: ButtonStyle.Secondary
        })
      ])]});
      let collector2 = botMessage.createMessageComponentCollector({ filter, time: 120_000 });
      collector2.on('end', async (collected, reason) => {
        if (reason == 'time') dismiss(message, botMessage);
      });
      collector2.on('collect', async (i) => {
        collector2.stop();
        await i.deferUpdate();

        // Get the levels data from the selected bot

        let users = [];
        switch (bot.customId) {
          case 'MEE6':
            let p = 0;
            while (true) {
              let json = await fetch(`https://mee6.xyz/api/plugins/levels/leaderboard/${message.guild.id}?page=${p}`).then(res => res.json());
              if (json.error) return botMessage.edit({embeds:[new EmbedBuilder()
                .setTitle('Error')
                .setDescription(`${lang.no_levels_found(bot = bot.customId)} ${lang.mee6_fix(message.guild.id)}`)
                .setColor('#e12929')
                .setImage('https://cdn.discordapp.com/attachments/862296245922037800/970653208777211994/unknown.png')
              ],components:[],content:null});
              if (!json?.players?.length) break;
              for (player of json.players) users.push({
                id:player.id,
                xp: i.customId == 'xp' ? player.xp : player.level*player.level*5
              });
              p++;
            }
            break;
          case 'AmariBot':
            let p1 = 1;
            while (true) {
              let json = await fetch(`https://amaribot.com/guild/leaderboard/${message.guild.id}?page=${p1}`).then(res => res.json());
              for (user of json.data) users.push({
                id: user.id,
                xp: i.customId == 'xp' ? +user.exp.replaceAll(',','') : user.level*user.level*5
              });
              if (!json.total_count || users.length > json.total_count) break;
              p1++;
            }
            break;
        }
        if (!users.length) return botMessage.edit({embeds:[new EmbedBuilder()
          .setTitle('Error')
          .setDescription(`${lang.no_levels_found(bot = bot.customId)}`)
          .setColor('#e12929')
        ],components:[],content:null});

        let leaderboard = await formatLeaderboard(users, message.guild, guildInfo, lang);
        await botMessage.edit({
          content: lang.import_leaderboard,
          embeds: [leaderboard],
          components: [new ActionRowBuilder().addComponents([
            new ButtonBuilder({
              customId: 'yes',
              emoji: emojis.PinkiePieYes,
              style: ButtonStyle.Success
            }),
            new ButtonBuilder({
              customId: 'no',
              emoji: emojis.PinkiePieNo,
              style: ButtonStyle.Danger
            })
          ])]
        })
        let collector3 = botMessage.createMessageComponentCollector({ filter, time: 120_000 });
        collector3.on('end', async (collected, reason) => {
          if (reason == 'time') dismiss(message, botMessage);
        });
        collector3.on('collect', async (confirm) => {
          collector3.stop();
          await confirm.deferUpdate();
          if (confirm.customId == 'no') return dismiss(message, botMessage);

          // Set user xp

          let db = await connectToDatabase();
          let guilds = db.db('chrysalis').collection('guilds');
          let guild = await guilds.findOne({id: message.guild.id});
          let modules = guild.modules;
          let rank = modules.find((c) => c.name == 'rank');
          rank.users = users;
          await guilds.updateOne({id: message.guild.id},{ $set: { modules: modules}});
          await db.close();
          await botMessage.edit({content:null, components:[], embeds:[{
            title: lang.migration_complete,
            description: lang.xp_successfully_imported,
            color: 0x44bf44
          }]});

        });
      });
    });
  }
}

async function dismiss(message, botMessage) {
  try {
    await botMessage.delete();
    await message.delete();
  } catch (e) {}
}
