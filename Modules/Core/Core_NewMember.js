//----NEW MEMBER HANDLER----

//Imports
const Canvas = require('canvas');
const Discord = require('discord.js');

//Exports
module.exports = {
    handleNewMember
};

//Functions
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');

    let fontSize = '70px';

    do {
        ctx.font = `${fontSize -= 10}px Julius Sans One`;
    } while (ctx.measure(text).width > canvas.width - 300);

    return ctx.font;
};

async function handleNewMember(fishsticks, newMember) {
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const channel = null; //Dispatch channel

    //Do canvas load
    const background = await Canvas.loadImage('../images/memberWelcomeBanner.jpg');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    //Build banner info
    if (fishsticks.TESTMODE) {
        //In test mode

        //--> Primary
        ctx.font = applyText(canvas, `[TEST] ${newMember.displayName}`);
        ctx.fillStyle('#ffffff');
        ctx.fillText(`[TEST] ${newMember.displayName}`, canvas.width / 2.5, canvas.height / 1.8);

        //--> Welcome
        ctx.font = '28px Julius Sans One';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Please dont mind, ', canvas.width / 2.5, canvas.height / 3.5);

        //--> Subheading
        ctx.font = '14px sans-serif';
        ctx.fillStyle('#ffffff');
        ctx.fillText('Go fix this thing already.', canvas.width / 2.5, canvas.height / 1.1);
    }
    else {
        //Not testing

        //--> Primary
        ctx.font = applyText(canvas, newMember.displayName);
        ctx.fillStyle('#ffffff');
        ctx.fillText(newMember.displayName, canvas.width / 2.5, canvas.height / 1.8);

        //--> Welcome
        ctx.font = '28px Julius Sans One';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Please welcome, ', canvas.width / 2.5, canvas.height / 3.5);

        //--> Subheading
        ctx.font = '14px sans-serif';
        ctx.fillStyle('#ffffff');
        ctx.fillText('Stick around for some fish!', canvas.width / 2.5, canvas.height / 1.1);
    }

    //Build avatar container
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    //Draw avatar
    const bannerAvatar = await canvas.loadImage(newMember.user.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(bannerAvatar, 25, 25, 200, 200);

    //Save and fire off
    const welcomeAttachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-banner.png');
    channel.send('Message', welcomeAttachment);
}