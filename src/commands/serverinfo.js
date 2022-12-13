const reply = require('../utils/reply.js');

module.exports = {
  name: 'serverinfo',
  alias: ['server-info','server','si'],
  run: async (client, message, command, args, lang, guildInfo) => {
    let created = Math.trunc(message.guild.createdTimestamp / 1000);
    let icon = message.guild.iconURL({size:1024});
    reply(message, {embeds:[{
      author: {name: message.guild.name, iconURL: icon},
      description: `__**${lang.server_info}**__`,
      color: guildInfo.color,
      thumbnail: { url: icon },
      fields: [
        { name: lang.server_owner, value: `${await message.guild.fetchOwner()}`, inline: true },
        { name: lang.server_id, value: message.guild.id, inline: true },
        { name: lang.member_count, value: `${message.guild.memberCount}`, inline: true },
        { name: lang.roles, value: `${message.guild.roles.cache.size-1}`, inline: true },
        { name: lang.channels, value: `${message.guild.channels.cache.size}`, inline: true },
        { name: lang.server_boosts, value: `${message.guild.premiumSubscriptionCount}`, inline: true },
        { name: lang.date_created, value: `<t:${created}:F> (<t:${created}:R>)`, inline: true }
      ]
    }]});
  }
}
