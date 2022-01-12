// ---- Build Profile Banner ----

//Imports

const Discord = require('discord.js');
const { createCanvas, registerFont, loadImage } = require('canvas');
const { log } = require('../Utility/Utils_Log');
const { fso_query } = require('../FSO/FSO_Utils');
const { embedBuilder } = require('./Utils_EmbedBuilder');

//Exports
module.exports = {
    buildProfileBanner
};

//Functions
async function buildProfileBanner(fishsticks, cmd, profileEmbed) {
    const memberProf = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: cmd.msg.author.id });
    const lvl = memberProf.xp.level;

    const forcedUser = await cmd.msg.author.fetch(true);

    //Create banner for newLvl
    log('info', '[XP-BANNER] Creating new profile banner.');

    //Register font
    registerFont('./Fonts/JuliusSansOne-Regular.ttf', { family: 'Julius Sans One' });

    //Create canvas context
    const canvas = createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    //Load BG
    const bgURL = forcedUser.bannerURL({ format: 'png', size: 4096 });
    let background;
    console.log(bgURL);
    if (!bgURL) {
        background = await loadImage('./Images/Utility/horvath-waves.jpg');
    }
    else {
        background = await loadImage(bgURL);
    }
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    log('info', '[XP-BANNER] Background loaded...');

    //Apply text
    //Upper title
    ctx.font = '30px Julius Sans One';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${cmd.msg.member.displayName}`, canvas.width / 2.5, canvas.height / 3.5);

    //Level shift
    ctx.font = '70px Trebuchet MS';
    ctx.fillStyle = '#add8e6';
    ctx.fillText(`${lvl}`, canvas.width / 1.9, canvas.height / 1.8);

    log('info', '[XP-BANNER] Text applications finished...');

    //Do badges/achievements
    const levelBadge = await loadImage(getLevelBadgePath(lvl));
    ctx.drawImage(levelBadge, canvas.width / 2.7, canvas.height / 3.8, 100, 100);

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
    const bannerAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-banner.png');
    cmd.channel.send({ embeds: [embedBuilder(profileEmbed)], files: [bannerAttachment] })
        .then(sent => { setTimeout(() => { sent.delete(); }, 60000); });
}


function getLevelBadgePath(newLvl) {
    if (newLvl <= 18) {
        return `./Images/Utility/Ranks/1-18/${newLvl}.png`;
    }
    else if (newLvl <= 36) {
        return `./Images/Utility/Ranks/19-36/${newLvl}.png`;
    }
    else if (newLvl <= 54) {
        return `./Images/Utility/Ranks/37-54/${newLvl}.png`;
    }
}