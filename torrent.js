const { EmbedBuilder, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
let Parser = require('rss-parser');
let parser = new Parser();
const reply = require('../utils/reply.js');
const iconURL = 'https://yayponies.no/favicon-32x32.png';

module.exports = {
  name: 'torrent',
  alias: ['torrents','episode','episodes','mylittlepony','mlp','fim','mlpfim','download','movie','movies'],
  run: async (client, message, command, args, lang, guildInfo) => {

    try { // Just in case yayponies is down
      let season = [];
      let feed = await parser.parseURL('https://yayponies.no/videos/rss/1it.rss');
      feed.items.forEach(item => {
        // Add episodes to seasons
        let currentSeason = +item.title.slice(item.title.indexOf('0'),item.title.indexOf('0')+2);
        let currentEpisode = +item.title.slice(item.title.indexOf('x')+1,item.title.indexOf('x')+3);
        season[currentSeason] ??= {episode:[]};
        // Trixie is best pony
        season[currentSeason].episode[currentEpisode] = {
          title: item.title.slice(item.title.indexOf('0'),item.title.indexOf('|')),
          link: item.link
        };
      });

      // Create season embeds
      let seasonEmbed = [];
      for (s in season) {
        if (s==='0') continue;
        seasonEmbed[s] = new EmbedBuilder()
          .setTitle(`${lang.season} ${s}`)
          .setColor(guildInfo.color)
          .setFooter({text:lang.torrent_footer,iconURL:iconURL})
        let episodes = [];
        for (e of season[s].episode) {
          if (!e) continue;
          episodes = `${episodes || ''}[${e.title}](${e.link})\n`;
        }
        seasonEmbed[s].setDescription(episodes);
      }

      // Select menu
      let menu = new SelectMenuBuilder()
        .setCustomId('torrent')
        .setPlaceholder(`${lang.seasons}:`); // For mobile
      for (s in season) {
        if (s==='0') continue;
        menu.addOptions({
          label: `${lang.season} ${s}`,
          value: s,
          default: s==='1'
        });
      }

      // Add movies too
      seasonEmbed[10] = new EmbedBuilder()
        .setTitle(lang.movies)
        .setColor(guildInfo.color)
        .setFooter({text:lang.torrent_footer,iconURL:iconURL})
        .setDescription('[My Little Pony: The Movie](https://yayponies.no/videos/torrents/YP-1R-TheMovie.mkv.torrent)\n[My Little Pony: A New Generation](https://yayponies.no/videos/torrents/YP-1N-G5-ANewGeneration.mkv.torrent)');
      menu.addOptions({
        label: lang.movies,
        value: '10'
      });

      // Send the message
      let m = await reply(message, {embeds:[seasonEmbed[1]], components: [new ActionRowBuilder().addComponents([menu])]});
      let filter = (interaction) => interaction.user.id === message.member.user.id;
      let collector = m.createMessageComponentCollector({ filter, time: 120000 });
      let index = 1;
      collector.on('collect', async (i) => {
        if (i.customId !== 'torrent') return;
        if (index == i.values[0]) return await m.edit({}).catch(r=>{}); // You can re-select the already selected option on the mobile app for some reason
        menu.options.find(o => o.data.value == index).data.default = false;
        index = i.values[0];
        menu.options.find(o => o.data.value == index).data.default = true;
        await m.edit({embeds:[seasonEmbed[index]], components: [new ActionRowBuilder().addComponents([menu])]}).then(i.deferUpdate()).catch(r=>{});
      });
      collector.on('end', async (collected, reason) => {
        if (reason == 'time') {
          await m.edit({embeds:[seasonEmbed[index].setFooter({text:`${seasonEmbed[index].data.footer.text}\n${lang.help_time_out}`, iconURL:iconURL})], components: []}).catch(r=>{});
        }
      });
    } catch (e) { return reply(message, {content:lang.error_fetching_episodes}, true); }
  }
}