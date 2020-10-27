const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_ids.json');
const syslog = require('../../Modules/Functions/syslog.js');
const permsCheck = require("../../Modules/Functions/permissionsCheck.js");
const subroutineCheck = require('../../Modules/Functions/subroutineCheck.js');

//State command required permissions
let permissions = {
    "perms": ["Staff", "Bot", "Event Coordinator"]
};

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    const announcements = fishsticks.channels.get(chs.announcements);

    function echoFunc(statement) {
        announcements.send(statement);
    }

    if (subroutineCheck.run(fishsticks, "echo", msg)) { //Make sure subroutine is running
        if (permsCheck.run(fishsticks, msg.member, permissions)) { //Check Perms
            if (fishsticks.engmode == true) {
                if (msg.member.roles.has(chs.bot)) {
                    syslog.run(fishsticks, "[ECHO-CMD] ENGM Override Executed: Permission granted to " + msg.author.tag, 1);
    
                    msg.reply("ENGM Override Recognized. Granting permissions to " + msg.author.tag + ".").then(sent => sent.delete(10000));
    
                    var milTime;

                    //Sanitize time parameter
                    try {
                        milTime = parseInt(cmd[0], 10);
                    } catch (processTimeErr) {
                        msg.reply("[ECHO-CMD] Hmmm, I'm seeing a electrical surge in sector 9 of my neural net. I think time is supposed to be a number.");
                    }

                    if (typeof milTime != 'number' || isNaN(milTime)) {
                        return msg.reply(`Hol' up, I can't wait '${cmd[0]}' minutes. That's gonna need to be a number.`).then(sent => sent.delete(15000));
                    }

                    if (milTime < 0) {
                        milTime = milTime * -1;
                    }

                    var waitTime = milTime * 60;
                    var cmdTime = waitTime * 1000;
    
                    var relayMSg = cmd.splice(1).join(' ');

                    syslog.run(fishsticks, "[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                    msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));

                    setTimeout(echoFunc, cmdTime, "here " + relayMSg);
                }
                else {
                    msg.reply("Engineering Mode is enabled. I can't let you do that.");
                }
            }
            else { //Not in ENGM
                var milTime;

                //Sanitize time parameter
                try {
                    milTime = parseInt(cmd[0], 10);
                } catch (processTimeErr) {
                    msg.reply("[ECHO-CMD] Hmmm, I'm seeing a electrical surge in sector 9 of my neural net. I think time is supposed to be a number.");
                }

                if (typeof milTime != 'number' || isNaN(milTime)) {
                    return msg.reply(`Hol' up, I can't wait '${cmd[0]}' minutes. That's gonna need to be a number.`).then(sent => sent.delete(15000));
                }

                if (milTime < 0) {
                    milTime = milTime * -1;
                }

                var waitTime = milTime * 60;
                var cmdTime = waitTime * 1000;
    
                var relayMSg = cmd.splice(1).join(' ');

                syslog.run(fishsticks, "[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));

                setTimeout(echoFunc, cmdTime, "@everyone " + relayMSg);
            }
        }
        else {
            msg.reply("Permissions check failed. Command restricted.");
        }
    }
    else {
        msg.reply("The `echo` subroutine is offline. Find " + fishsticks.ranger + " and get him to turn it back on!").then(sent => sent.delete(15000));
    }
}