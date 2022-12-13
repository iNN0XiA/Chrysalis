const reply = require('../utils/reply.js');

module.exports = {
  name: 'emoji',
  alias: ['jumbo'],
  run: async (client, message, command, args, lang, guildInfo) => {

    for (guild of client.guilds.cache.values()) await guild.emojis.fetch();
    let emoji = (args[0]?.split(':')[2]) ? client.emojis.resolve(args[0].split(':')[2].replace('>','')) : client.emojis.cache.find((e) => e.name === args[0]?.split(':')[1]);
    if (!emoji) return reply(message, {content:lang.couldn_t_find_that_emoji}, true);

    reply(message, {embeds:[{
      title: lang.download_emoji,
      url: emoji.url,
      color: guildInfo.color,
      image: { url: emoji.url }
    }]});

  }
}
