module.exports.imageFinder = function findImage(message) {
    return new Promise(async (resolve, reject) => {
        try {

            let messages = await message.channel.messages.fetch({ limit: 2 });
            let attachmentMessages = messages
                .map((message) => {
                    let attachmentURL = undefined;
                    if (message.attachments.first()) {
                        attachmentURL = message.attachments.first().proxyURL;
                       console.log(attachmentURL); // If message has image attachment set as URL
                    } else {
                        if (message.embeds[0] && message.embeds[0].type == "image") {
                            attachmentURL = message.embeds[0].url;
                            console.log("jpg/png image found"); // If message has image embed set as URL
                        }
                        if (message.embeds[0] && message.embeds[0].type == "gifv") {
                            attachmentURL = message.embeds[0].url + (message.embeds[0].url.match(/(\.gif)/gi) ? "" : ".gif");
                                console.log("gif image found"); // If message has gifv embed set as URL (Ensuring it ends with .gif)
                        }
                        if (message.embeds[0] && message.embeds[0].image != null) {
                            attachmentURL = message.embeds[0].image.url; 
                            console.log(message.embeds[0].image.url);// If message is an embed with an image
                    
                        }
                    }
                    if (attachmentURL) console.log("image found"); return attachmentURL; // Return image URL for each message
                })
                .filter((a) => a != undefined); // Filter out messages with no image
            if (attachmentMessages[0]) {
                resolve(attachmentMessages[0]); // Resolve image URL
            } else {
                reject("No Image found");
            }
            // }
        } catch (e) {
            reject(e);
        }
    });
}
     



module.exports.extensionFinder = function get_url_extension( url ) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
}






