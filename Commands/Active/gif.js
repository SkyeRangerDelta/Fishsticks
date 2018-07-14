const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const got = require('got');
const gip = require('../../Modules/fs_systems.json');

const apik = gip.giphyapi;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    console.log("[GIF-COMM] Attempting GIF embed...")

    var cmdStr = cmd.splice(0);

    gif();

    async function gif() {
        var res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${apik}&tag=${cmdStr}&rating=g`, {json: true}).catch(console.error);

        if (!res || !res.body || !res.body.data) {
            msg.reply("I can't find a GIF like that it would seem.");
            return;
        }

        console.log("[GIF-COMM] Embed URL: " + "http://media2.giphy.com/media/" + res.body.data.id + "/giphy.gif")

        var dispatch = new Discord.RichEmbed();
        dispatch.setTitle("o0o - RANDOM GIF! - o0o");
        dispatch.setColor(config.fscolor);
        dispatch.setDescription("(" + cmdStr + ")")
        dispatch.setImage("http://media2.giphy.com/media/" + res.body.data.id + "/giphy.gif");

        msg.channel.send({embed: dispatch});
    }
}