const actionEmbed = require('../utils/embed/actionEmbed.js');

module.exports = {
    name: 'attack',
    alias: ['attacks, fight'],
    run: async (client, message, command, args, lang, guildInfo) => {

        const gifs = [
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056341600575426580/attackone.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056341677981302904/attacktwo.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056341821367799878/attackthree.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056341933594792027/attackfour.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056342019372482590/attackfive.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056342112662196265/attacksix.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056342218895536168/attackseven.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056342311845503067/attackeight.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056342568855687189/attacknine.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056342690482114640/attackten.gif'
        ];

        actionEmbed(message, guildInfo.color, args, {
            text: lang.attack_title,
            gifs: gifs,
            onSelf: {
                text: lang.attack_self,
                gifs: ['https://cdn.discordapp.com/attachments/1001601329497636997/1056334844646400040/attackself.gif']
            },
            onChrysalis: {
                text: lang.attack_chrysalis,
                gifs: ['https://cdn.discordapp.com/attachments/1001601329497636997/1056333420558553178/fightchrysalis.gif']
            }
        });

    }
}