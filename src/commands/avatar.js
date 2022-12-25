const mention2id = require('../utils/mention2id.js');
const reply = require('../utils/reply.js');

module.exports = {
    name: 'avatar',
    alias: ['pfp'],
    run: async (client, message, command, args, lang, guildInfo) => {

        let taggedUser = mention2id(args[0]) || message.member.user.id;
        try {
            taggedUser = await message.guild.members.fetch(taggedUser)
        } catch (e) {
            try {
                taggedUser = await client.users.fetch(taggedUser);
            } catch (e) {
                return reply(message, { content: lang.couldn_t_find_that_user }, true)
            }
        }


        // If tagged user is Chrysalis, send profile picture artwork source
        if (taggedUser.id == client.user.id) return reply(message, 'https://i.imgur.com/z3tf8tC.png');

        return reply(message, {
            embeds: [{
                title: lang.avatar(taggedUser.displayName || taggedUser.username),
                image: { url: taggedUser.displayAvatarURL({ size: 4096 }) },
                color: taggedUser.displayColor || guildInfo.color
            }]
        });

    }
}
