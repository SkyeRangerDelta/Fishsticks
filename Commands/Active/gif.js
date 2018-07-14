const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const got = require('got');
const gip = require('../../Modules/fs_systems.json');

const apik = gip.giphyapi;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    console.log("[GIF-COMM] Attempting GIF embed...")
    console.log("[GIF-COMM] API: " + apik);

    var cmdStr = cmd.splice(0);
    var res = 0;

    if (cmdStr == null) {
        msg.reply("Hey, I can't search for nothing! Gimmie something to look up!");
        return;
    }

    gif();

    async function gif() {
        res = await got(`http://api.giphy.com/v1/gifs/search?q=${cmdStr}$api_key=${apik}&limit=5`, {json: true}).catch(console.error);
    }

    if (!res || !res.body || !res.body.data) {
        msg.reply("I can't find a GIF like that it would seem.");
        return;
    }

    var dispatch = new Discord.RichEmbed();
        dispatch.setTitle("o0o - RANDOM GIF! - o0o");
        dispatch.setColor(config.fscolor);
        dispatch.setImage(res.body.data.image_url);

    msg.channel.send({embed: dispatch});
}