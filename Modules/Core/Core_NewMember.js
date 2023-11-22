//----NEW MEMBER HANDLER----

//Imports
const Discord = require('discord.js');

const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { log } = require('../Utility/Utils_Log');

const chs = require('./Core_ids.json');

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

//Process generating a graphic and sending it
async function handleNewMember(fishsticks, newMember) {
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    //Get hangout
    const dispatchChannel = await fishsticks.channels.cache.get(chs.hangout);

    //Do canvas load
    const background = await loadImage('./Images/Utility/memberWelcomeBanner.jpg');
    log('info', '[NEW-MEM] Background loaded, running canvas edits...');

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Apply text
    //--> Primary
    ctx.font = applyText(canvas, `${newMember.displayName}`);
    ctx.fillStyle = '#add8e6';
    ctx.fillText(`${newMember.displayName}`, canvas.width / 2.5, canvas.height / 1.8);

    //--> Welcome
    ctx.font = '30px Trebuchet MS';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Please welcome, ', canvas.width / 2.5, canvas.height / 3.5);

    //--> Subheading
    ctx.font = '26px Trebuchet MS';
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
    dispatchChannel.send({ content: `Welcome ${newMember} to the server!`, files: [welcomeAttachment] });
}