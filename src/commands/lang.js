const reloadSlashCommands = require('../utils/reloadSlashCommands.js');
const connectToDatabase = require('../utils/connectToDatabase.js');
const path = require('path');
const fs = require('fs');
const reply = require('../utils/reply.js');
const validLangs = fs.readdirSync(path.resolve(__dirname, '../lang/')).filter((f) => f.endsWith('.js') && !f.includes('commands')).map(f => f.slice(0,f.indexOf('.js')));

module.exports = {
  name: 'lang',
  alias: ['setlang','language','setlanguage'],
  admin: true,
  validLangs: validLangs,
  run: (client, message, command, args, lang, guildInfo) => {
    if (validLangs.indexOf(args[0])>-1) return changeLang(client, message, args[0]);
    message.channel.send({embeds:[{
      title: lang.available_languages,
      description: validLangs.map(l=>`${l} (${require(`../lang/${l}.js`).meta.name})`).join('\n'),
      color: guildInfo.color
    }]});
  }
}

async function changeLang(client, message, newLang) {
  let db = await connectToDatabase();
  let guilds = db.db('chrysalis').collection('guilds');
  let guild = await guilds.findOne({id: message.guild.id});
  await guilds.updateOne(guild,{ $set: { lang: newLang}});
  guild.lang = newLang;
  db.close();
  reloadSlashCommands(client, message.guild, guild);
  reply(message, {content:require(`../lang/${newLang}.js`).meta.new_lang_message});
}
