const request = require('request');
const cheerio = require('cheerio');

module.exports = {
    name: 'randompony',
    alias: ['random', 'pony'],
    run: async (client, message, lang, guildInfo) => {
            options = {
            url: "https://thisponydoesnotexist.net/",
            method: "GET",
            headers: {
                "Accept": "text/html",
                "User-Agent": "Chrome"
            }
        };

        fetchImage(client, query, message, guildInfo.color, lang);

            if (error) { console.log('Its funny, really.'); return; }

        cheerio.load(responseBody);
        let links = $(".furry-quilt a.furry-link img ");
        message.channel.send(links[1]);
        let = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("src"));

        console.log(urls);
        if (!urls.length) {
            message.channel.send('invalid array allocation: urls.length < 0');
            message.channel.send(urls[1]);
            console.log('What a lovely but absolutely ridiculous sentiment.');

            return;
        }

        else {
            message.channel.send("This Pony Does Not Exist:");
            urls.shift();
            message.channel.send(urls[1]);
            return;
        }


    });



}
}