const Discord = require('discord.js');

let mattybmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.roles.find('name', 'Recognized') || msg.member.roles.find('name', 'Staff')) {

        mattybmode = !mattybmode;
        fishsticks.mattybmode = mattybmode;

        console.log("[MTB-MODE] Toggled to " + mattybmode + " by " + msg.author.tag);
        msg.reply("Music Player: MattyB Mode has been toggled " + mattybmode + ".");
    }
    else {
        msg.reply("How dare you challenge me with your primitive powers...begone!");
    }
}