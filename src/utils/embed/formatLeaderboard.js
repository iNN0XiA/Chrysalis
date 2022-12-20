
module.exports = async (users, guild, guildInfo, lang) => {
  let lb = ''
  let highscores = users.sort((a, b) => (a.xp < b.xp) ? 1 : -1);
  for (i in highscores.slice(0,10)) {
    lb+=`${getNumberEmoji(+i+1)} ► <@${highscores[i].id}>
          ${lang.level}: \`${Math.trunc((Math.sqrt(5)/5)*Math.sqrt(highscores[i].xp))}\`
          XP: \`${highscores[i].xp}\`\n`;
  }
  return {
    title: lang.leaderboard_title,
    description: lb,
    color: guildInfo.color,
    thumbnail: { url: guild.iconURL({size:1024}) }
  };
}


function getNumberEmoji(n) {
  switch (n) {
    case 1:
    return ':first_place:'
    case 2:
    return ':second_place:'
    case 3:
    return ':third_place:'
    case 4:
    return ':four:'
    case 5:
    return ':five:'
    case 6:
    return ':six:'
    case 7:
    return ':seven:'
    case 8:
    return ':eight:'
    case 9:
    return ':nine:'
    case 10:
    return ':keycap_ten:'
  }
}
