// ---- Shiny System ----
// Renders a graphic of a sent message in a glamorous way

//Imports
const Discord = require('discord.js');

const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { log } = require('./Utils_Log');

//Exports
module.exports = {
	handleShiny
};

//Functions
//Whatever this is supposed to be used for
function applyText(canvas, text) {
	const ctx = canvas.getContext('2d');
	let fontSize = 16;

	do {
		ctx.font = `${fontSize -= 10}px Trebuchet MS`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
}

//Actually generate the graphic
async function handleShiny(msg) {
	log('info', '[SHINY] Generating a new shiny graphic');

	msg.delete({ timeout: 0 });

	//Register and create canvas
	const canvas = createCanvas(700, 250);
	const ctx = canvas.getContext('2d');

	//Load BG
	const background = await loadImage('./Images/Utility/shinyBanner.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

	//Apply text
	ctx.font = applyText(canvas, msg.content);
	ctx.fillStyle = 'rgba(173,216,230,0.64)';
	ctx.fillText(`${msg.content}`, canvas.width / 2.5, canvas.height / 1.8);

	//Save and fire off
	const shinyAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-banner.png');
	await msg.channel.send({ content: 'Oooooh, pretty...', files: [shinyAttachment] });
}