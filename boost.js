const boostEmbed = require('../utils/embed/boostEmbed.js');
const mention2id = require('../utils/mention2id.js');

module.exports = {
  name: 'boost',
  alias: ['nitro'],
  admin: true,
  run: async (client, message, command, args, lang, guildInfo) => {

    boostEmbed(
      await args[0] ? await message.guild.members.fetch(mention2id(args[0])).catch(r=>{}) : null || message.member,
      guildInfo,
      message.channel,
      message.author ? null : message
    );

  }
}