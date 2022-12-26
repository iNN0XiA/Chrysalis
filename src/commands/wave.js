const actionEmbed = require('../utils/embed/actionEmbed.js');

module.exports = {
    name: 'wave',
    alias: ['waving','hello'],
    run: async (client, message, command, args, lang, guildInfo) => {

        const gifs = [
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056927499847749743/waveone.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056927526884220978/wavetwo.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056927537441296484/wavethree.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056927574275674192/wavefour.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056927603455443104/wavefive.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056929549742518302/wavesix.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056929567547326494/waveseven.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056929581216571423/waveeight.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056929613944737852/wavenine.gif',
            'https://cdn.discordapp.com/attachments/1001601329497636997/1056929628914208849/waveten.gif'
        ];

        actionEmbed(message, guildInfo.color, args, {
            text: lang.wave_title,
            gifs: gifs,
            onSelf: {
              text: lang.wave_self,
              gifs: ['https://cdn.discordapp.com/attachments/1001601329497636997/1056931663126466712/waveself.gif']
            },
            onChrysalis: {
              text: lang.wave_chrysalis,
              gifs: ['https://cdn.discordapp.com/attachments/1001601329497636997/1056930197150109788/wavechrysalis.gif']
            },
            onEverypony: {
              gifs: ['https://cdn.discordapp.com/attachments/862296245922037800/876471497655468032/-_everypony.gif']
            }
          });
      
        }
      }