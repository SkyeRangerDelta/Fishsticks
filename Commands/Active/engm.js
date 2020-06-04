const Discord = require('discord.js');
const sys = require('../../Modules/Core/coresys.json');
const fs = require('fs');

const log = require('../../Modules/Functions/log.js');

let engmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    //LOGGER
    function syslog(message, level) {
        try {
            log.run(fishsticks, message, level);
        }
        catch (err) {
            fishsticks.systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
        }
    }

    if (msg.member.roles.find('name', 'Bot') || msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Holodeck Dev')) {
        var engmFile = JSON.parse(fs.readFileSync('./Modules/fishsticks_engm.json', 'utf8'));
        engmode = engmFile.engmode;

        engmode = !engmode;
        fishsticks.engmode = engmode;
        fishsticks.subroutines.set("engm", engmode);

        console.log("[ENG-MODE] Toggled to " + engmode + " by " + msg.author.tag);
        syslog("[ENG-MODE] Toggled to " + engmode + " by " + msg.author.tag, 4);
        msg.reply("Fishsticks Engineering Mode has been toggled " + engmode + ".").then(sent => sent.delete({timeout: 5000}));

        if (engmode) {
            fishsticks.user.setPresence({
                game: {
                    name: `ENGM Enabled! | !help`,
                    type: 'WATCHING'
                },
                status: 'idle'
            });
        } else {
            fishsticks.user.setPresence({
                game: {
                    name: `!help | V${fishsticks.version}`,
                    type: 'WATCHING'
                },
                status: 'online'
            });
        }

        engmFile.engmode = engmode;
        fs.writeFileSync('./Modules/fishsticks_engm.json', JSON.stringify(engmFile));
    }
    else {
        msg.reply("How dare you challenge me with your primitive powers...begone!").then(sent => sent.delete({timeout: 5000}));
    }
}