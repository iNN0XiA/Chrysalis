const { EmbedBuilder } = require('discord.js');
const mention2id = require('../mention2id.js');
const reply = require('../reply.js');

module.exports = async (message, color, args, action) => {

  let author = message.member.nickname || message.member.user.username;

  let targetUser = await message.guild.members.fetch(mention2id(args[0]) || message.mentions.users.first()?.id || message.member.id).catch(r=>{}) || args.join(' ');
  let onSelf = targetUser.id == message.member.id;
  let onChrysalis = targetUser.id == message.client.user.id;

  color = targetUser.displayColor || color;
  targetUser = targetUser.nickname || targetUser?.user?.username;

  if (['@everyone','@here','@everypony'].indexOf(targetUser) > -1) targetUser = 'everypony';

  let embed = new EmbedBuilder().setColor(color);

  if (onSelf) embed
    .setTitle(action.onSelf.text.replace(`{0}`,author))
    .setImage(pickRandomElement(action.onSelf.gifs));
  else
  if (onChrysalis && action.onChrysalis) embed
    .setTitle(action.onChrysalis.text.replace(`{0}`,author))
    .setImage(pickRandomElement(action.onChrysalis.gifs));
  else
  if (targetUser === 'everypony' && action.onEverypony) embed
    .setTitle(action.onEverypony.text.replace(`{0}`,author))
    .setImage(pickRandomElement(action.onEverypony.gifs));
  else embed
    .setTitle(action.text.replace('{0}',author).replace('{1}',targetUser).substring(0,256))
    .setImage(pickRandomElement(action.gifs));

  reply(message, {embeds:[embed]});

}

function pickRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
