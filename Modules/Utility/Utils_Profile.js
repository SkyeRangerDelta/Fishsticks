// ---- Build Profile Banner ----

//Imports
const Canvas = require('@napi-rs/canvas');
const { log } = require('../Utility/Utils_Log');
const { fso_query } = require('../FSO/FSO_Utils');
const { embedBuilder } = require('./Utils_EmbedBuilder');
const { AttachmentBuilder } = require('discord.js');

//Exports
module.exports = {
    buildProfileBanner
};

//Functions
async function buildProfileBanner(fishsticks, int, profileEmbed) {
    const memberProf = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: int.member.id });
    const lvl = memberProf.xp.level;

    const forcedUser = await int.member.user.fetch(true);

    //Create banner for newLvl
    log('info', '[XP-BANNER] Creating new profile banner.');

    //Create canvas context
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    //Load BG
    const bgURL = forcedUser.bannerURL({ format: 'png', size: 4096 });
    let background;
    if (!bgURL) {
        background = await Canvas.loadImage('./Images/Utility/horvath-waves.jpg');
    }
    else {
        background = await Canvas.loadImage(bgURL);
    }
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    log('info', '[XP-BANNER] Background loaded...');

    //Add a darkening overlay
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, 700, 250);
    ctx.globalAlpha = 1.0;

    //Apply text
    //Upper title
    ctx.font = '30px Trebuchet MS';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${int.member.displayName}`, canvas.width / 2.5, canvas.height / 3.5);

    //Level Detail
    ctx.font = '70px Verdana';
    ctx.fillStyle = '#add8e6';
    ctx.fillText(`${lvl}`, canvas.width / 1.9, canvas.height / 1.8);

    //Quick Info
    ctx.font = '25px Trebuchet MS';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`XP: ${memberProf.xp.RP}`, canvas.width / 2.5, canvas.height / 1.1);
    ctx.fillText(`Goldfish: ${memberProf.xp.goldfish}`, canvas.width / 1.7, canvas.height / 1.1);

    log('info', '[XP-BANNER] Text applications finished...');

    //Do badges/achievements
    const levelBadge = await Canvas.loadImage(getLevelBadgePath(lvl));
    ctx.drawImage(levelBadge, canvas.width / 2.7, canvas.height / 3.8, 100, 100);

    //Do avatar container
    //Draw avatar outline container
    /*
    ctx.beginPath();
    ctx.fillStyle = '#86c5DA';
    ctx.arc(125, 125, 105, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
    ctx.clip();
     */

    //Build avatar container
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    //Draw avatar
    const bannerAvatar = await Canvas.loadImage(forcedUser.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(bannerAvatar, 25, 25, 200, 200);

    //Save and send
    log('info', '[NEW-MEM] Banner saved, pending dispatch');
    const bannerAttachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'welcome-banner.png' });
    if (!profileEmbed) {
        int.channel.send({ files: [bannerAttachment], ephemeral: true })
            .then(sent => { setTimeout(() => { sent.delete(); }, 60000); });
    }
    else {
        int.channel.send({ embeds: [embedBuilder(profileEmbed)], files: [bannerAttachment] })
            .then(sent => { setTimeout(() => { sent.delete(); }, 60000); });
    }
}


function getLevelBadgePath(newLvl) {
    if (newLvl <= 18) {
        return `./Images/Utility/Ranks/1-18/${newLvl}.png`;
    }
    else if (newLvl <= 36) {
        return `/Images/Utility/Ranks/19-36/${newLvl}.png`;
    }
    else if (newLvl <= 54) {
        return `./Images/Utility/Ranks/37-54/${newLvl}.png`;
    }
    else if (newLvl <= 72) {
        return `./Images/Utility/Ranks/55-72/${newLvl}.png`;
    }
    else if (newLvl <= 90) {
        return `./Images/Utility/Ranks/73-90/${newLvl}.png`;
    }
    else if (newLvl <= 108) {
        return `./Images/Utility/Ranks/91-108/${newLvl}.png`;
    }
}