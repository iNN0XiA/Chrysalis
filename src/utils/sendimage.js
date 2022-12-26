const gm = require("gm");

let { attachment, embed, MessageAttachment } = require('discord.js');

module.exports = async function sendImage(
    msg,
    cmdName,
    startTime,
    img,
    extension,
    procMsg,
    forceWeb = false
) {
    if (procMsg) procMsg.edit(process.env.MSG_UPLOADING);
   
    const attachment = new MessageAttachment(
        Buffer.from(img),
        "image." + extension
    ); // Create attachment
    let timeTaken = formatDuration(new Date().getTime() - startTime); // Time elapsed since command call

        // Send image on Discord
        let embed = new MessageEmbed({
            title: cmdName,
            description: `<@${msg.member.id}> ${process.env.MSG_SUCCESS}`,
            color: Number(process.env.EMBED_COLOUR),
            timestamp: new Date(),
            author: {
                name: "FlutterBot",
                icon_url: msg.client.user.displayAvatarURL(),
            },
            image: {
                url: "attachment://image." + extension,
            },
            footer: {
                text: `Took ${timeTaken}`,
            },
        });
        msg
            .followUp({ embeds: [embed], files: [attachment] })
            .then(() => {
                // msg.channel.stopTyping();
                //if (procMsg) procMsg.delete();
            })
            .catch(async (err) => {
                console.log(err);
                attemptSendImageWeb(msg, cmdName, timeTaken, img, extension, procMsg); // If send fails, try with local web host
            });
    
}