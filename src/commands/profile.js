const { TextInputBuilder, ActionRowBuilder, ButtonBuilder, TextInputStyle, ButtonStyle, ModalBuilder, resolveColor } = require('discord.js');
const Canvas = require('canvas');
const connectToDatabase = require('../utils/connectToDatabase.js');
const reply = require('../utils/reply.js');

module.exports = {
  name: 'profile',
  alias: ['profile','editprofile'],
  modal: true,
  run: async (client, message, command, args, lang, guildInfo) => {

    if (!message.author) return showModal(message, lang);

    let button = await reply(message, {
      content: lang.click_to_open_modal,
      components:[new ActionRowBuilder().addComponents(new ButtonBuilder({
        customId: 'profile-button',
        label: lang.profile,
        style: ButtonStyle.Primary
    }))]}, true);
    button.awaitMessageComponent({filter: (i) => i.user.id === message.author.id && i.customId === 'profile-button', time: 12_000})
      .then(i=>showModal(i, lang, button, message))
      .catch(async () => {
        try {
          await button.delete();
          await message.delete();
        } catch (e) {}
      });
      
  }
}

async function showModal(i, lang, button, message) {
  let data = await getData(i.member.id);
  await i.showModal(new ModalBuilder({
    customId: 'profile',
    title: lang.profile,
    components: [
      new ActionRowBuilder().addComponents(
        new TextInputBuilder({
          customId: 'color',
          label: lang.color,
          style: TextInputStyle.Short,
          value: data.color,
          placeholder: data.color?.slice(0,7),
          required: false
        })
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder({
          customId: 'bgURL',
          label: lang.background_image,
          style: TextInputStyle.Short,
          value: data.bgURL,
          placeholder: data.bgURL?.slice(0,100),
          required: false
        })
      )
    ]
  }));
  let filter = (interaction) => interaction.customId === 'profile';
  i.awaitModalSubmit({ filter, time: 120_000 })
    .then(async (answer) => {

      if (button && message) try {
        await button.delete();
        await message.delete();
      } catch (e) {}

      let newColor = answer.fields.getTextInputValue('color');
      let newBG = answer.fields.getTextInputValue('bgURL');
      
      if (newColor) {
        newColor = `#${newColor.replaceAll('#','').repeat(6).slice(0,6)}`;
        try {
          resolveColor(newColor);
        } catch (e) {
          return answer.reply({content:lang.invalid_color, ephemeral:true});
        }
      }
  
      if (newBG) {
        try {
          await Canvas.loadImage(newBG);
        } catch (e) {
          return answer.reply({content:lang.unsupported_image_type, ephemeral:true});
        }
      }
  
      if (!newColor && !newBG) return answer.reply({content:lang.please_specify_a_new_value, ephemeral:true});

      let db = await connectToDatabase();
      let users = db.db('chrysalis').collection('users');
      let userPrefs = await users.findOne({id:i.member.id});
      if (newColor) await users.updateOne({id: i.member.id},{ $set: { color: newColor}});
      if (newBG) await users.updateOne({id: i.member.id},{ $set: { bgURL: newBG}});
      db.close();

      return answer.reply({embeds:[{
        title: lang.profile_updated,
        color: resolveColor(newColor || userPrefs.color || guildInfo.color),
        image: { url: newBG || userPrefs.bgURL }
      }], ephemeral:true});

    }).catch(r => {});
}

async function getData(id) {
  let db = await connectToDatabase();
  let users = db.db('chrysalis').collection('users');
  let userPrefs = await users.findOne({id:id});
  if (!userPrefs) {
    await users.insertOne({id:id});
    userPrefs = await users.findOne({id:id});
  }
  db.close();
  return userPrefs;
}
