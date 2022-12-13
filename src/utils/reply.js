module.exports = async (message, response, ping) => {
    if (message.author)  {
        if (ping) {
            try {
                return await message.reply(response);
            } catch (e) {
                if (response.content) response.content = `${message.member} ${response.content}`;
                return await message.channel.send(response).catch(r=>{});
            }
        }
        else return await message.channel.send(response).catch(r=>{});
    } else {
        await message.deferReply(response).catch(r=>{});
        return await message.editReply(response).catch(r=>{});
    }
}
