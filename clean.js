const { PermissionsBitField } = require("discord.js");
const reply = require('../utils/reply.js');

module.exports = {
  name: 'clean',
  alias: ['bulkdelete','bulk-delete','clear','purge'],
  admin: true,
  ephemeral: true,
  run: async (client, message, command, args, lang, guildInfo) => {
    if (!message.channel.permissionsFor(client.user.id).has(PermissionsBitField.Flags.ManageMessages)) return reply(message, {content:lang.bulk_delete_missing_permissions}, true);
    if (!isNaN(args[0])) {
      let messagesToDelete = parseInt(args[0]);
      if (message.author) messagesToDelete++;
      if (messagesToDelete <= 100) try {
        await message.channel.bulkDelete(messagesToDelete);
      } catch (e) {
        return reply(message, {content:lang.bulk_delete_two_weeks}, true);
      }
      else return reply(message, {content:lang.bulk_delete_max_100}, true);
      if (!message.author) message.editReply(lang.messages_deleted(messagesToDelete));
    }
  }
}