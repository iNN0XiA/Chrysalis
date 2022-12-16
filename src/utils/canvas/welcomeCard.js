const { AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
const { fillTextWithTwemoji } = require('node-canvas-with-twemoji-and-discord-emoji');

module.exports = async (lang, bgURL, channel, user, content, i) => {
	// Create canvas
	let canvas = Canvas.createCanvas(960,540);
	let ctx = canvas.getContext('2d');

	// Set background image (if any)
	if (bgURL) {
		try {
			let bg = await Canvas.loadImage(bgURL);
			ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
		} catch (e) {/* Image URL is invalid */}
	}

	// Text
	Canvas.registerFont('./src/fonts/Montserrat-Black.ttf',{ family: 'Montserrat', weight: 'Black' });
	ctx.font = '96px Montserrat Black';
	ctx.textAlign = 'center';
	ctx.fillStyle = 'white';
	ctx.shadowColor = 'rgba(0,0,0,1)';
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowBlur = 10;
	// Welcome
	ctx.fillText(lang.welcome.toUpperCase(), canvas.width/2, canvas.height/2+136);
	ctx.font = '48px Montserrat Black';
	// Username
	await fillTextWithTwemoji(ctx, `${user.username.length > 21 ? user.username.toUpperCase().slice(0,18)+'...' : user.username.toUpperCase()}#${user.discriminator}`, canvas.width/2, canvas.height/2+182);
	ctx.font = '36px Montserrat Black';
	// Member count
	ctx.fillText(lang.you_are_the_member_n(channel.guild.memberCount).toUpperCase(), canvas.width/2, canvas.height/2+220);

	// Profile picture
	const radius = 128;
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2-80, radius, 0, Math.PI * 2, true);
	ctx.strokeStyle = 'white';
	ctx.lineWidth = '15';
	ctx.stroke();
	ctx.closePath();
	ctx.clip();
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
	try {
		let pfp = await Canvas.loadImage(user.displayAvatarURL({ extension: 'png', size: 1024 }));
		ctx.drawImage(pfp, canvas.width/2-radius, canvas.height/2-radius-80, radius*2, radius*2);
	} catch (e) { /* Avatar couldn't be fetched. The avatar will be completely transparent. */ }

	// Send the image
	let message;
	let attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });
	if (['','...','off','none','null','false'].indexOf(content.trim()) > -1) {
		message = {files: [attachment]};
	} else {
		if (content == 'default') content = lang.defaultValues.welcome.message;
		message = {content: content.replaceAll('{user}',user).replaceAll('{guild}',channel.guild.name), files: [attachment]}
	}
	return i ? i.editReply(message) : channel.send(message);
}
