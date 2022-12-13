const reply = require('../utils/reply.js');

module.exports = {
  name: 'roleinfo',
  alias: ['role-info','ri'],
  run: async (client, message, command, args, lang, guildInfo) => {

    if (!args[0]) return reply(message, {content:lang.unkown_role}, true);

    await message.guild.members.fetch();
    await message.guild.roles.fetch();

    let requestedRole = message.guild.roles.cache.find(role => role.name.toLowerCase().includes(args.join(' ').toLowerCase()));
    requestedRole ??= message.guild.roles.cache.find(role => role.id == args[0]);
    requestedRole ??= message.guild.roles.cache.find(role => role.id == args[0].slice(3,-1));

    if (!requestedRole) return reply(message, {content:lang.unkown_role}, true);

    let created = Math.trunc(requestedRole.createdTimestamp / 1000);

    reply(message, {embeds:[{
      description: `__**${lang.role_info}**__`,
      color: requestedRole.color,
      fields: [
        { name: lang.name, value: `${requestedRole}` },
        { name: lang.role_id, value: `${requestedRole.id}` },
        { name: lang.color, value: `${requestedRole.hexColor}` },
        { name: lang.member_count, value: `${requestedRole.members.size}` },
        { name: lang.date_created, value: `<t:${created}:F> (<t:${created}:R>)` }
      ]
    }]});

  }
}
