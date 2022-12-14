const fetch = require('node-fetch');
const reply = require('../utils/reply.js');

module.exports = {
    name: 'emoji',
    alias: ['jumbo'],
    run: async (client, message, command, args, lang, guildInfo) => {

        if (!args[0]) return reply(message, { content: lang.couldn_t_find_that_emoji }, true);

        let id = args[0].split(':')[2]?.replace('>', '') || args[0];
        let emoji = id.startsWith(':') && id.endsWith(':') ? client.emojis.cache.find(e => e.name == id.slice(1, -1)) : client.emojis.cache.get(id);
        let image = emoji?.url || client.rest.cdn.emoji(id, args[0].startsWith('<:') ? 'png' : 'gif');

        if (id == args[0]) {
            let gif = await fetch(image);
            if (!gif.ok) image = `${image.slice(0, -3)}png`;
        }

        let res = await fetch(image);
        if (!res.ok) return reply(message, { content: lang.couldn_t_find_that_emoji }, true);

        reply(message, {
            embeds: [{
                title: lang.download_emoji,
                url: image,
                color: guildInfo.color,
                image: { url: image }
            }]
        });

    }
}
