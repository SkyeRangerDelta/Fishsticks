const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const got = require('got');
const gip = require('../../Modules/fs_systems.json');

const log = require('../../Modules/Functions/syslog.js');

const apik = gip.tenorapi;

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
    syslog("[GIF-COMM] Attempting GIF embed...", 1);

    var cmdStr = cmd.splice(0).join(' ');

    if (cmdStr == "" || cmdStr == " ") {
        cmdStr = "Randomness";
    }

    gif();

    async function gif() {
        try {
            var res = await got(`https://api.tenor.com/v1/random?key=${apik}&q=${cmdStr}&locale=en_US&contentfilter=high`, {json: true}).catch(console.error);

            if (!res || !res.body || !res.body.results) {
                syslog("[GIF-COMM] No content found. Res error?", 2);
                return msg.reply("I can't find a GIF like that it would seem.").then(sent => sent.delete({timeout: 15000}));
            }

            syslog(`[GIF-COMM] Embed URL: ${res.body.results[0].url}`, 1);

            msg.channel.send(`__**RANDOM GIF!**__\n${res.body.results[0].url}`);
            msg.channel.send("*Search term: " + cmdStr + "*");

        } catch (error) {
            console.log("[GIF-COMM] Something went wrong in the gif script.\n" + error)
            msg.reply("Looks like that didn't have any results...interesting.").then(sent => sent.delete({timeout: 10000}));
        }
    }
}