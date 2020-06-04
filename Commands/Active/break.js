const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const syslog = require('../../Modules/Functions/syslog.js');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    msg.reply("[ALPHA LEVEL COMMAND]\nRequest user confirmation - please enter your username.").then(sent => sent.delete({timeout: 10000}));

    var response;
    var username = msg.author.username;
    username = username.toLowerCase().trim();

    doTheThing();

    async function doTheThing() {
        try {
            response = await msg.channel.awaitMessages(msg2 => msg2.content.toLowerCase().trim() == username, {
                maxMatches: 1,
                time: 10000,
                errors: ['time']
            });
        }
        catch (error) {
            syslog.run(fishsticks, "[BREAK-COMMAND] Timer ran out.", 1);

            msg.reply("[`FISHSTICKS **CORE**`] Command Aborted: Confirmation Failure").then(sent => sent.delete({timeout: 10000}));
        }

        if (response) {
            msg.channel.send("[`FISHSTICKS **CORE**`] System shutdown engaged. Runtime process code: `" + genCode() + 
            "`\nInitiating shutdown sequence...\n").then(sent => sent.delete({timeout: 25000}));
    
            for (var i = 5; i >= 0; i--) {
                msg.channel.send("Shutdown in " + i).then(sent => sent.delete({timeout: 10000}));
    
                if (i == 0) {
                    msg.channel.send("\nWell this has been fun. Good to see that you found this command.\n\n`Core shutdown aborted by internal process.`").then(sent => sent.delete({timeout: 30000}));
                    return
                }
            }
        }
        else {
            msg.channel.send("[`FISHSTICKS **CORE**`] System shutdown aborted - process neutralized. That was close.").then(sent => sent.delete({timeout: 15000}));
        }
    }

    function genCode() {
        let code = Math.random().toString(36).replace('0.', '');
        syslog.run(fishsticks, "[FISHSTICKS CORE] System shutdown launch code generated.\nValid code available: " + code, 4);

        return code;
    }
}