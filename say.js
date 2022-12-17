const reply = require('../utils/reply.js');

module.exports = {
  name: 'say',
  alias: ['text'],
  run: async (client, message, command, args, lang, guildInfo) => {

    if (!message.author) {
      let bannedwords = guildInfo.modules.find(m => m.name == 'bannedwords');
      if (bannedwords.enabled) for (word of bannedwords.words) if (args[0].includes(word)) return;
    }

    reply(message, args.join(' ') || '_ _');

  }
}