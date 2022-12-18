const formatLeaderboard = require('../utils/embed/formatLeaderboard.js');
const reply = require('../utils/reply.js');

module.exports = {
  name: 'leaderboard',
  alias: ['lb','highscores','top','leaderboards'],
  dependsOn: 'rank',
  run: async (client, message, command, args, lang, guildInfo) => {
  	let rank = guildInfo.modules.find((c) => c.name == 'rank');
    let leaderboard = await formatLeaderboard(rank.users, message.guild, guildInfo, lang);
    reply(message, {embeds:[leaderboard]});
  }
}