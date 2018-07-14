const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const got = require('got');
const gip = require('../../Modules/fs_systems.json');

const apik = gip.giphyapi;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    const res = await got(`http://api.giphy.com/v1/gifs/random?api-key=${apik}&tag=${encodeURIComponent(cmd[0])}`, {json: true});

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