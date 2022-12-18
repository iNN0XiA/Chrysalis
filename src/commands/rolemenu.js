const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const reply = require('../utils/reply.js');
const emojis = require('../emojis.js');

module.exports = {
  name: 'rolemenu',
  alias: ['role-menu'],
  admin: true,
  ephemeral: true,
  modal: true,
  run: async (client, message, command, args, lang, guildInfo) => {

    if (!message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return reply(message, {content:lang.manage_roles_permission_required,ephemeral:true}, true);

    let data = await setUp(message, lang);
    if (!data) return;

    let roles = [];
    await message.guild.roles.fetch();
    let skipped = false;
    for (let role of [...new Set(data.roles)]) try {
      roles.push(message.guild.roles.cache.get(role).id);
    } catch (e) { skipped = true; }

    if (roles.length == 0) return data.interaction.reply({content:lang.no_valid_roles_found,ephemeral:true});
    if (roles.length > 25) return data.interaction.reply({content:lang.you_can_only_add_up_to_25_roles_to_the_menu,ephemeral:true});

    let rows = []
    rows[0] = roles.slice(0,5)
    rows[1] = roles.slice(5,10)
    rows[2] = roles.slice(10,15)
    rows[3] = roles.slice(15,20)
    rows[4] = roles.slice(20,25)

    let buttonRow = [];

    for (let [index, row] of rows.entries()) {
      if (row.length == 0) break;
      buttonRow[index] = new ActionRowBuilder()
      for (let role of row) {
        buttonRow[index].addComponents(new ButtonBuilder({
          style: ButtonStyle.Primary,
          label: message.guild.roles.cache.get(role).name,
          customId: `role-${role}`
        }));
      }
    }

    let title = data.title || lang.role_menu;
    let description = data.description || lang.select_the_roles_that_you_want;
    message.channel.send({embeds: !title && !description ? null : [{
      title: title,
      description: description,
      color: guildInfo.color
    }], components : buttonRow });

    data.interaction.reply({content: skipped ? lang.invalid_roles_skipped : emojis.PinkiePieYes, ephemeral: true});

  }
}

async function setUp(i, lang) {

  if (i.author) {
    let button = await reply(i, {
      content: lang.click_to_open_modal,
      components:[new ActionRowBuilder().addComponents(new ButtonBuilder({
        customId: 'rolemenu-button',
        label: lang.role_menu,
        style: ButtonStyle.Primary
    }))]}, true);
    return await button.awaitMessageComponent({filter: b => b.user.id === i.author.id && b.customId === 'rolemenu-button', time: 12_000})
      .then(b=>setUp(b, lang))
      .catch(async () => {
        try {
          await button.delete();
          await i.delete();
        } catch (e) {}
      });
  }

  await i.showModal(new ModalBuilder({
    customId: `rolemenu-${i.id}`,
    title: lang.role_menu,
    components: [
      new ActionRowBuilder().addComponents(
        new TextInputBuilder({
          customId: 'title',
          label: lang.title,
          style: TextInputStyle.Short,
          value: lang.role_menu,
          required: false
        })
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder({
          customId: 'description',
          label: lang.description,
          style: TextInputStyle.Paragraph,
          value: lang.select_the_roles_that_you_want,
          required: false
        })
      ),
      new ActionRowBuilder().addComponents(
        new TextInputBuilder({
          customId: 'roles',
          label: lang.roles,
          style: TextInputStyle.Paragraph,
          required: true
        })
      )
    ]
  }));
  let answer = await i.awaitModalSubmit({ filter: a => a.customId === `rolemenu-${i.id}`, time: 120_000 }).catch(r=>{});
  if (!answer) return;
  return {
    title: answer.fields.getTextInputValue('title'),
    description: answer.fields.getTextInputValue('description'),
    roles: answer.fields.getTextInputValue('roles')
      .replaceAll(' ','\n')
      .replaceAll(',','\n')
      .replaceAll('<','\n')
      .replaceAll('@','\n')
      .replaceAll('>','\n')
      .split('\n')
      .filter(e=>e!==''),
    interaction: answer
  };

}