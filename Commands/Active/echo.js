const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_ids.json');
const syslog = require('../../Modules/Functions/log.js');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //LOGGER
    function log(message, level) {
        try {
            syslog.run(fishsticks, message, level);
        }
        catch (err) {
            fishsticks.systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
        }
    }

    const announcements = fishsticks.channels.get(chs.announcements);

    function echoFunc(statement) {
        announcements.send(statement);
    }

    if (fishsticks.subroutines.get("echo")) {
        if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Bot') || msg.member.roles.find('name', 'Event Coordinator')) {
            if (fishsticks.engmode == true) {
                if (msg.member.roles.find('name', 'Bot')) {
                    console.log("[ECHO-CMD] ENGM Override Executed: Premission granted to " + msg.author.tag + ".");
                    log("[ECHO-CMD] ENGM Override Executed: Permission granted to " + msg.author.tag, 1);
    
                    msg.reply("ENGM Override Recognized. Granting permissions to " + msg.author.tag + ".").then(sent => sent.delete(10000));
    
                    var type = cmd[0];
    
                    var milTime = cmd[1];
                    var waitTime = milTime * 60;
                    var cmdTime = waitTime * 1000;
    
                    var relayMSg = cmd.splice(2).join(' ');
    
                    switch (type) {
                        case "none":
                            console.log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                            log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                            msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));
    
                            setTimeout(echoFunc, cmdTime, "@here " + relayMSg);
                        break;
                        case "all":
                            console.log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                            log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                            msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));
    
                            setTimeout(echoFunc, cmdTime, "@here " + relayMSg);
                        break;
                        default:
                            console.log("[ECHO-CMD] Command halted on account of invalid parameter.");
                            log("[ECHO-CMD] Command halted on account of invalid parameter.", 1);
                            msg.reply("Invalid type selection; post stopped.\nDid you use this: `!echo [division/all] [delayTime] [message]`? -> See `!info echo`").then(sent => sent.delete(15000));
                            return;
                        break;
                    }
                }
                else {
                    msg.reply("Engineering Mode is enabled. Command restricted.");
                }
            }
            else {
                var type = cmd[0];
    
                var milTime = cmd[1];
                var waitTime = milTime * 60;
                var cmdTime = waitTime * 1000;
    
                var relayMSg = cmd.splice(2).join(' ');
    
                switch (type) {
                    case "pubg":
                        console.log("[ECHO-CMD] Message Received for Division: PUBG. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        log("[ECHO-CMD] Message Received for Division: PUBG. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: PUBG").then(sent => sent.delete(10000));
    
                        setTimeout(echoFunc, cmdTime, pubg + " " + relayMSg);
                    break;
                    case "ark":
                        console.log("[ECHO-CMD] Message Received for Division: Ark SE. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        log("[ECHO-CMD] Message Received for Division: Ark SE. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Ark SE").then(sent => sent.delete(10000));
    
                        setTimeout(echoFunc, cmdTime, ark + " " + relayMSg);
                    break;
                    case "ow":
                        console.log("[ECHO-CMD] Message Received for Division: Overwatch. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        log("[ECHO-CMD] Message Received for Division: Overwatch. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Overwatch").then(sent => sent.delete(10000));
    
                        setTimeout(echoFunc, cmdTime, ow + " " + relayMSg);
                    break;
                    case "none":
                        console.log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));
    
                        setTimeout(echoFunc, cmdTime, "@here " + relayMSg);
                    break;
                    case "all":
                        console.log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg, 1);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));
    
                        setTimeout(echoFunc, cmdTime, "@here " + relayMSg);
                    break;
                    default:
                        console.log("[ECHO-CMD] Command halted on account of invalid parameter.");
                        log("[ECHO-CMD] Command halted on account of invalid parameter.", 1);
                        msg.reply("Invalid type selection; post stopped.\nDid you use this: `!echo [division/all] [delayTime] [message]`? -> See `!info echo`").then(sent => sent.delete(15000));
                    break;
                }
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