const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const chs = require('../Modules/fs_channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    const announcements = fishsticks.channels.get(chs.announcements);

    function echoFunc(statement) {
        announcements.send(statement);
    }

    var rl = msg.guild.roles.find('name', 'Rocket League');
    var pubg = msg.guild.roles.find('name', 'PUBG');
    var ark = msg.guild.roles.find('name', 'Ark: SE');
    var ow = msg.guild.roles.find('name', 'Overwatch');

    if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Bot')) {
        if (fishsticks.engmode == true) {
            if (msg.member.roles.find('name', 'Bot')) {
                console.log("[ECHO-CMD] ENGM Override Executed: Premission granted to " + msg.author.tag + ".");

                msg.reply("ENGM Override Recognized. Granting permissions to " + msg.author.tag + ".");

                var type = cmd[0];

                var milTime = cmd[1];
                var waitTime = milTime * 60;
                var cmdTime = waitTime * 1000;

                var relayMSg = cmd.splice(2).join(' ');

                switch (type) {
                    case "rl":
                        console.log("[ECHO-CMD] Message Received for Division: Rocket League. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Rocket League").then(sent => sent.delete(10000));
    
                        setTimeout(echoFunc, cmdTime, rl + " " + relayMSg);
                    break;
                    case "pubg":
                        console.log("[ECHO-CMD] Message Received for Division: PUBG. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: PUBG").then(sent => sent.delete(10000));

                        setTimeout(echoFunc, cmdTime, pubg + " " + relayMSg);
                    break;
                    case "ark":
                        console.log("[ECHO-CMD] Message Received for Division: Ark SE. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Ark SE").then(sent => sent.delete(10000));

                        setTimeout(echoFunc, cmdTime, ark + " " + relayMSg);
                    break;
                    case "ow":
                        console.log("[ECHO-CMD] Message Received for Division: Overwatch. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Overwatch").then(sent => sent.delete(10000));

                        setTimeout(echoFunc, cmdTime, ow + " " + relayMSg);
                    break;
                    case "none" || "all":
                        console.log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                        msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));

                        setTimeout(echoFunc, cmdTime, "@here " + relayMSg);
                    break;
                    default:
                        msg.reply("Invalid type selection; post stopped.");
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
                case "rl":
                    console.log("[ECHO-CMD] Message Received for Division: Rocket League. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                    msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Rocket League").then(sent => sent.delete(10000));

                    setTimeout(echoFunc, cmdTime, "@Rocket League " + relayMSg);
                break;
                case "pubg":
                    console.log("[ECHO-CMD] Message Received for Division: PUBG. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                    msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: PUBG").then(sent => sent.delete(10000));

                    setTimeout(echoFunc, cmdTime, "@PUBG " + relayMSg);
                break;
                case "ark":
                    console.log("[ECHO-CMD] Message Received for Division: Ark SE. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                    msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Ark SE").then(sent => sent.delete(10000));

                    setTimeout(echoFunc, cmdTime, "@Ark: SE " + relayMSg);
                break;
                case "ow":
                    console.log("[ECHO-CMD] Message Received for Division: Overwatch. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                    msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nDivision recognized: Overwatch").then(sent => sent.delete(10000));

                    setTimeout(echoFunc, cmdTime, "@Overwatch " + relayMSg);
                break;
                case "none" || "all":
                    console.log("[ECHO-CMD] Message Received - No division noted. Awaiting " + milTime + " minute(s) to relay message: " + relayMSg);
                    msg.reply("Command Received. Awaiting " + milTime + " minute(s) to deploy.\nNo division noted.").then(sent => sent.delete(10000));

                    setTimeout(echoFunc, cmdTime, "@here " + relayMSg);
                break;
                default:
                    msg.reply("Invalid type selection; post stopped.");
            }
        }
    }
    else {
        msg.reply("Permissions check failed. Command restricted.");
    }
}