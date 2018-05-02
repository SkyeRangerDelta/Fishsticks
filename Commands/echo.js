const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const chs = require('../Modules/fs_channels.json');

const announcements = fishsticks.channels.get(chs.announcements);

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    function echoFunc(statement) {
        announcements.send(statement);
    }

    if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Bot')) {
        if (fishsticks.engmode == true) {
            if (msg.member.roles.find('name', 'Bot')) {
                console.log("[ECHO-CMD] ENGM Override Executed: Premission granted to " + msg.author.tag + ".");

                msg.reply("ENGM Override Recognized. Granting permissions to " + msg.author.tag + ".");

                var milTime = cmd[0];
                var waitTime = milTime * 60;
                var cmdTime = waitTime * 1000;
                var relayMSg = cmd.splice(1).join(' ');

                console.log("[ECHO-CMD] Message Received. Awaiting " + waitTime + " minute(s) to relay message: " + relayMSg);
                msg.reply("Command Received. Awaiting " + waitTime + " minute(s) to deploy.").then(sent => sent.delete(10000));

                setTimeout(echoFunc, cmdTime, "@everyone " + relayMSg);
            }
            else {
                msg.reply("Engineering Mode is enabled. Command restricted.");
            }
        }
        else {
            var milTime = cmd[0];
            var waitTime = milTime * 60;
            var cmdTime = waitTime * 1000;
            var relayMSg = cmd.splice(1).join(' ');

            console.log("[ECHO-CMD] Message Received. Awaiting " + waitTime + " minute(s) to relay message: " + relayMSg);
            msg.reply("Command Received. Awaiting " + waitTime + " minute(s) to deploy.").then(sent => sent.delete(10000));

            setTimeout(echoFunc, cmdTime, "@here " + relayMSg);
        }
    }
    else {
        msg.reply("Permissions check failed. Command restricted.");
    }
}