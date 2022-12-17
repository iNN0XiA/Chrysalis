const reply = require('../utils/reply.js');

module.exports = {
  name: 'bannedwords',
  alias: ['addword','addwords','delword','deleteword','removeword','delwords','deletewords','removewords','listwords','wordslist','wordlist'],
  admin: true,
  run: (client, message, command, args, lang, guildInfo) => {

    reply(message, {content:lang.bannedwords_deprecated}, true);

  }
}