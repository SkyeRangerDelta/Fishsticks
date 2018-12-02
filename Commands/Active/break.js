const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

const log = require('../../Modules/Functions/log.js');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //LOGGER
    function syslog(message, level) {
		try {
			log.run(fishsticks, message, level);
		}
		catch (err) {
			systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
		}
	}

    msg.reply("[ALPHA LEVEL COMMAND]\nRequest user confirmation - please enter your username.").then(sent => sent.delete(10000));

    var response;
    var username = msg.author.username;
    username = username.toLowerCase();

    doTheThing();

    async function doTheThing() {
        try {
            response = await msg.channel.awaitMessages(msg2 => msg2.content.toLowerCase() == username, {
                maxMatches: 1,
                time: 10000,
                errors: ['time']
            });
        }
        catch (error) {
            console.log("[BREAK-COMMAND] Timer ran out.");
            syslog("[BREAK-COMMAND] Timer ran out.", 1);

            msg.reply("[`FISHSTICKS **CORE**`] Command Aborted: Confirmation Failure").then(sent => sent.delete(10000));
        }

        if (response) {
            msg.channel.send("[`FISHSTICKS **CORE**`] System shutdown engaged. Runtime process code: `" + genCode() + 
            "`\nInitiating shutdown sequence...\n").then(sent => sent.delete(25000));
    
            for (var i = 5; i >= 0; i--) {
                msg.channel.send("Shutdown in " + i).then(sent => sent.delete(10000));
    
                if (i == 0) {
                    msg.channel.send("\nWell this has been fun. Good to see that you found this command.\n\n`Core shutdown aborted by internal process.`").then(sent => sent.delete(30000));
                    return
                }
            }
        }
        else {
            msg.channel.send("[`FISHSTICKS **CORE**`] System shutdown aborted - process neutralized. That was close.").then(sent => sent.delete(15000));
        }
    }

    function genCode() {
        let code = Math.random().toString(36).replace('0.', '');
        console.log("[FISHSTICKS CORE] System shutdown launch code generated.\nValid code available: " + code);
        syslog("[FISHSTICKS CORE] System shutdown launch code generated.\nValid code available: " + code, 4);

        return code;
    }
}