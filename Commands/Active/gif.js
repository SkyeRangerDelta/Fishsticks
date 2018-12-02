const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const got = require('got');
const gip = require('../../Modules/fs_systems.json');

const log = require('../../Modules/Functions/log.js');

const apik = gip.giphyapi;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //LOGGER
    function syslog(message, level) {
        try {
            log.run(fishsticks, message, level);
        }
        catch (err) {
            fishsticks.systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
        }
    }

    console.log("[GIF-COMM] Attempting GIF embed...");
    syslog("[GIF-COMM] Attempting GIF embed...", 1);

    var cmdStr = cmd.splice(0).join(' ');

    gif();

    async function gif() {
        try {
            var res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${apik}&tag=${cmdStr}&rating=g`, {json: true}).catch(console.error);

            if (!res || !res.body || !res.body.data || !res.body.data.id) {
                msg.reply("I can't find a GIF like that it would seem.");
                return;
            }

            console.log("[GIF-COMM] Embed URL: " + "http://media2.giphy.com/media/" + res.body.data.id + "/giphy.gif");
            syslog("[GIF-COMM] Embed URL: " + "http://media2.giphy.com/media/" + res.body.data.id + "/giphy.gif", 1);

            var dispatch = new Discord.RichEmbed();
            dispatch.setTitle("o0o - RANDOM GIF! - o0o");
            dispatch.setColor(config.fscolor);
            dispatch.setDescription("Search: " + cmdStr);
            dispatch.setImage("http://media2.giphy.com/media/" + res.body.data.id + "/giphy.gif");

            msg.channel.send({embed: dispatch});
        } catch (error) {
            console.log("[GIF-COMM] Something went wrong in the gif script.\n" + error)
            msg.reply("Something went wrong. Try again maybe?").then(sent => sent.delete(10000));
        }
    }
}