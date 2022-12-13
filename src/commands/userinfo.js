const mention2id = require('../utils/mention2id.js');
const reply = require('../utils/reply.js');

module.exports = {
  name: 'userinfo',
  alias: ['user-info','ui','user','memberinfo','member-info','mi','member'],
  run: async (client, message, command, args, lang, guildInfo) => {
    let taggedUser = mention2id(args[0]);
    // If there is no mention, check if the command is replying to another user's message. If not, use command author.
    if (!taggedUser) return message.mentions?.members.first() ? showMemberInfo(client, command, message, message.mentions.members.first(), guildInfo.color, lang) : showMemberInfo(client, command, message, message.member, guildInfo.color, lang);
    asyncMember(client, command, message, taggedUser, guildInfo.color, lang);
  }
}

async function asyncMember(client, command, message, taggedUser, color, lang) {
  try {
    taggedUser = await message.guild.members.fetch(taggedUser);
    showMemberInfo(client, command, message, taggedUser, color, lang);
  } catch (e) {
    try {
      taggedUser = await client.users.fetch(taggedUser);
      showUserInfo(client, command, message, taggedUser, color, lang);
    } catch (e) {
      return reply(message, {content:lang.couldn_t_find_that_user}, true);
    }
  }
}

function showMemberInfo(client, command, message, member, color, lang) {
  let joined = Math.trunc(member.joinedTimestamp / 1000);
  let created = Math.trunc(member.user.createdTimestamp / 1000);
  reply(message, {embeds:[{
    description: `__**${lang.user_info}**__`,
    color: color,
    thumbnail: { url: member.user.displayAvatarURL({size:1024}) },
    fields: [
      { name: lang.name, value: member.user.tag },
      { name: lang.user_id, value: member.id },
      { name: lang.server_join_date, value: `<t:${joined}:F> (<t:${joined}:R>)` },
      { name: lang.account_creation_date, value: `<t:${created}:F> (<t:${created}:R>)` },
      { name: lang.roles, value: member.roles.cache.map(roles => `${roles}`).join(' ') }
    ]
  }]});
}

function showUserInfo(client, command, message, taggedUser, color, lang) {
  let created = Math.trunc(taggedUser.createdTimestamp / 1000);
  reply(message, {embeds:[{
    description: `__**${lang.user_info}**__`,
    color: color,
    thumbnail: { url: taggedUser.displayAvatarURL({size:1024}) },
    fields: [
      { name: lang.name, value: `${taggedUser.username}#${taggedUser.discriminator}` },
      { name: lang.user_id, value: taggedUser.id },
      { name: lang.account_creation_date, value: `<t:${created}:F> (<t:${created}:R>)` }
    ]
  }]});
}
