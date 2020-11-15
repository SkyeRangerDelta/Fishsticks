//----NEW MEMBER HANDLER----

//Imports
const { createCanvas, registerFont, loadImage } = require('canvas');
const Discord = require('discord.js');
const { log } = require('../Utility/Utils_Log');

//Exports
module.exports = {
    handleNewMember
};

//Functions
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 70;

    do {
        ctx.font = `${fontSize -= 10}px Trebuchet MS`;
    } while (ctx.measureText(text).width > canvas.width - 300);

    log('info', '[NEW-MEM] Text header applications done.');
    return ctx.font;
};

async function handleNewMember(fishsticks, newMember) {
    registerFont('./Fonts/JuliusSansOne-Regular.ttf', { family: 'Julius Sans One' });
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const channel = fishsticks.CONSOLE; //Dispatch channel

    //Do canvas load
    const background = await loadImage('./images/memberWelcomeBanner.jpg');
    log('info', '[NEW-MEM] Background loaded, running canvas edits...');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Apply text
    //--> Primary
    ctx.font = applyText(canvas, `${newMember.displayName}`);
    ctx.fillStyle = '#add8e6';
    ctx.fillText(`${newMember.displayName}`, canvas.width / 2.5, canvas.height / 1.8);

    //--> Welcome
    ctx.font = '30px Julius Sans One';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Please welcome, ', canvas.width / 2.5, canvas.height / 3.5);

    //--> Subheading
    ctx.font = '26px Julius Sans One';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Stick around for some fish!', canvas.width / 2.5, canvas.height / 1.1);
    log('info', '[NEW-MEM] Text applications done.');

    //Draw avatar outline container
    ctx.beginPath();
    ctx.fillStyle = '#86c5DA';
    ctx.arc(125, 125, 105, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
    ctx.clip();

    //Build avatar container
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    //Draw avatar
    const bannerAvatar = await loadImage(newMember.user.displayAvatarURL({ format: 'png' }));
    log('info', '[NEW-MEM] Banner saved, pending dispatch');
    ctx.drawImage(bannerAvatar, 25, 25, 200, 200);

    //Save and fire off
    const welcomeAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-banner.png');
    channel.send('Dropping the mic on the haters.', welcomeAttachment);
}