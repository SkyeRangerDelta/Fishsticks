const Discord = require('discord.js');

let mattybmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.roles.find('name', 'Recognized') || msg.member.roles.find('name', 'Staff')) {

        mattybmode = !mattybmode;
        fishsticks.subroutines.set("matb", mattybmode);

        console.log("[MTB-MODE] Toggled to " + mattybmode + " by " + msg.author.tag);
        msg.reply("Music Player: MattyB Mode has been toggled " + mattybmode + ".").then(sent => sent.delete(10000));
    }
    else {
        msg.reply("How dare you challenge me with your primitive powers...begone!").then(sent => sent.delete(10000));
    }
}