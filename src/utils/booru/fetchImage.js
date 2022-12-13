const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fetch = require('node-fetch');
const reply = require('../reply.js');

module.exports = async function fetchImage(client, query, message, color, numberOfPages, lang) {
  let randomPage = numberOfPages > 1 ? Math.floor(Math.random() * numberOfPages)+1 : 1;
  try {
    await fetch(`https://manebooru.art/api/v1/json/search/images?q=${query}&page=${randomPage}`)
      .then(res => res.json())
      .then(async json => {

        // Search in all pages
        if (numberOfPages == 1 && json.total > 50) {
          numberOfPages = Math.trunc(json.total/50)+1;
          return fetchImage(client, query, message, color, numberOfPages, lang);
        }

        // Embed message
        let randomImage = json.images[Math.floor(Math.random() * json.images.length)];
        let imageID = randomImage.id;
        let sourceURL = randomImage.source_url;
        let embed = {
          author: {
            name: 'Manebooru',
            url: `https://manebooru.art/${imageID}`,
            iconURL: 'https://static.manebooru.art/img/view/2020/8/2/4000004.png'
          },
          title: lang.image_source,
          url: sourceURL && sourceURL != 'https://' ? sourceURL : `https://manebooru.art/images/${imageID}`,
          description: `${lang.requested_by} ${message.member}`,
          image: { url: randomImage.view_url },
          color: color
        }
        let row = new ActionRowBuilder().addComponents(new ButtonBuilder({
          label: lang.how_to_delete,
          customId: `report-https://manebooru.art/images/${imageID}/reports/new${message.author ? `-${message.id}` : ''}`,
          style: ButtonStyle.Danger
        }));
        reply(message, {embeds:[embed],components:[row]});
      })
  } catch (e) {
    reply(message, {content:lang.no_images_found}, true);
  }
}
