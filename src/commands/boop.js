const actionEmbed = require('../utils/embed/actionEmbed.js');

module.exports = {
    name: 'boop',
    alias: ['boops'],
    run: async (client, message, command, args, lang, guildInfo) => {

        const gifs = [
            'https://cdn.discordapp.com/attachments/862296245922037800/862297017576718356/2bf.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297031712440320/8f6720fb8b277f120658fbceef9303b0.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297055162793995/AgileRectangularArizonaalligatorlizard-size_restricted.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297054977196052/2d4.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297060099620894/medium.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297077941665812/1537606__safe_screencap_bonbon_daisy_flowerwishes_lily_lilyvalley_rarity_roseluck_sweetiedrops_itisn.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297091980001301/boop.gif.065a0274d6c444d7496d388adbe7e58a.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297095889092608/boop.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/862297089329070080/uwuwuwu.gif',
            'https://cdn.discordapp.com/attachments/862296245922037800/931735996675006524/donut.gif'
        ];

        actionEmbed(message, guildInfo.color, args, {
            text: lang.boop_title,
            gifs: gifs,
            onSelf: {
                text: lang.boop_self,
                gifs: ['https://cdn.discordapp.com/attachments/862296245922037800/862297045339602984/cd0.gif']
            },
            onChrysalis: {
                text: lang.boop_chrysalis,
                gifs: ['https://cdn.discordapp.com/attachments/862296245922037800/874339788264734720/-_chrysalis.gif']
            }
        });

    }
}