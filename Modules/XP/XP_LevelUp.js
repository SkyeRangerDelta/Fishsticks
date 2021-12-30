// ---- Level Up ----
// Handles banner creation

//Imports
const Discord = require('discord.js');
const { createCanvas, registerFont, loadImage } = require('canvas');

const { hangout, prReqs, announcements } = require('../Core/Core_ids.json');
const { log } = require('../Utility/Utils_Log');

//Exports
module.exports = {
    createLevelBanner
};

//Functions
async function createLevelBanner(fishsticks, cmd, newLvl) {
    //Create banner for newLvl
    log('info', '[XP-BANNER] Creating new XP level up banner.');

    //Register font
    registerFont('./Fonts/JuliusSansOne-Regular.ttf', { family: 'Julius Sans One' });

    //Create canvas context
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    //Load BG
    const background = await loadImage('./Images/Utility/horvath-waves.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    log('info', '[XP-BANNER] Background loaded...');

    //Apply text
    //Upper title
    ctx.font = '30px Julius Sans One';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Level up!', canvas.width / 2.5, canvas.height / 3.5);

    //Level shift
    ctx.font = '70px Trebuchet MS';
    ctx.fillStyle = '#add8e6';
    ctx.fillText(`${newLvl - 1} -> ${newLvl}`, canvas.width / 2.5, canvas.height / 1.8);

    //Lower title
    ctx.font = '26px Julius Sans One';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Congrats on your work!', canvas.width / 2.5, canvas.height / 1.1);

    log('info', '[XP-BANNER] Text applications finished...');

    //Do avatar container
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
    const bannerAvatar = await loadImage(cmd.msg.author.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(bannerAvatar, 25, 25, 200, 200);

    //Save and send
    log('info', '[NEW-MEM] Banner saved, pending dispatch');
    const xpBannerAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-banner.png');

    if (cmd.channel.id === prReqs || cmd.channel.id === announcements) {
        //Redirect out of serious chats
        const hangoutCh = await fishsticks.channels.cache.get(hangout);
        hangoutCh.send({ content: 'Level up!', files: [xpBannerAttachment] });
    }
    else {
        cmd.channel.send({ content: 'Level up!', files: [xpBannerAttachment] });
    }
}