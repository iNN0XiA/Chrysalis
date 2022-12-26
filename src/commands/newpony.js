const cheerio = require('cheerio');
const request = require('request');

module.exports = {
    name: 'newpony',
    description: 'Get an entirely Unique Pony!',
    run: async (guildInfo) => {
        
        let filter = guildInfo.modules.find((c) => c.name == 'newpony').filter
            request: "https://ifunny.co/tags/" + args,
            cheerio: "GET",
            headers: {
                "Accept": "text/html",
                "User-Agent": "Chrome"

            }
        }

    }
}
