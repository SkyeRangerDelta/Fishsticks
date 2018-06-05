const Discord = require('discord.js');
const sys = require('../../Modules/Core/coresys.json');
const fs = require('fs');

let engmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.roles.find('name', 'Bot') || msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Holodeck Dev')) {
        var engmFile = JSON.parse(fs.readFileSync('./Modules/fishsticks_engm.json', 'utf8'));
        engmode = engmFile.engmode;

        engmode = !engmode;
        fishsticks.engmode = engmode;

        console.log("[ENG-MODE] Toggled to " + engmode + " by " + msg.author.tag);
        msg.reply("Fishsticks Engineering Mode has been toggled " + engmode + ".");

        if (engmode == true) {
            fishsticks.user.setActivity("ENGM Enabled! | !help");
        }
        else {
            fishsticks.user.setActivity("!help | V" + sys.fsversion);
        }

        engmFile.engmode = engmode;
        fs.writeFileSync('./Modules/fishsticks_engm.json', JSON.stringify(engmFile));
    }
    else {
        msg.reply("How dare you challenge me with your primitive powers...begone!");
    }
}