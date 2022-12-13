const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const reply = require('../utils/reply.js');

module.exports = {
  name: 'e621',
  alias: ['furry','yiff'],
  nsfw: true,
  run: async (client, message, command, args, lang, guildInfo) => {
    try {
      // No way to count pages for now, sorry.
      // If you're too horny and 320 images aren't enough, type more tags.
      await fetch(`https://e621.net/posts.json?${args.length>0 ? `tags=${message.author ? args.join('+') : args[0].replaceAll(' ', '+')}&limit=320` : 'limit=320'}`, {
        headers: {
          'User-Agent': 'Chrysalis (programmerpony)' // Type your e621 username between the parenthesis
        }
      }).then(res => res.json()).then(async json => {
        randomImage = json.posts[Math.floor(Math.random() * json.posts.length)];
        imageID = randomImage.id;
        imageURL = randomImage.file.url;
        sourceURL = randomImage.sources[0];
        let row = new ActionRowBuilder().addComponents(new ButtonBuilder({
          label: lang.how_to_delete,
          customId: `report-https://e621.net/tickets/new?disp_id=${imageID}&type=post${message.author ? `-${message.id}` : ''}`,
          style: ButtonStyle.Danger
        }));
        return reply(message, {content:`https://e621.net/posts/${imageID}`,components:[row]});
      });
    } catch (e) {
      return reply(message, {content:lang.no_images_found}, true);
    }
  }
}
