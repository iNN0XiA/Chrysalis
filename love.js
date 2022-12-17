const reply = require('../utils/reply.js');

module.exports = {
  name: 'love',
  alias: ['amor','lovemeter','ship'],
  run: async (client, message, command, args, lang, guildInfo) => {

    let lovers = message.mentions ? Array.from(message.mentions.members.values()) : [await message.guild.members.fetch(args[0]), await message.guild.members.fetch(args[1])];
    if (!lovers.length) return reply(message, {content:lang.type_one_or_two_users}, true);

    if (!lovers[1]) {
      lovers[1] = lovers[0];
      lovers[0] = message.author;
    }

    if (lovers[0].id == message.member.id && lovers[1].id == message.member.id) return reply(message, lang.self_love);

    let lovePercent = Math.floor(Math.random()*100+1);
    let lovePerTen = Math.floor(lovePercent/10);
    let percentBar = `${'🟥'.repeat(lovePerTen)}${'⬜'.repeat(10-lovePerTen)}`
    let percentMessage = lang.lovemeter_messages[lovePerTen];

    if (lovers.find(l=>l.id===client.user.id) || lovers[1] == lovers[0]) {
      lovePercent = 0;
      percentBar = '⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜';
      percentMessage = '...';
    }

    reply(message, {embeds:[{
      title: `${lovers[0].displayName} x ${lovers[1].displayName}`,
      description: `${lovePercent}% ${percentBar}\n${percentMessage}`,
      color: guildInfo.color
    }]});

  }
}