const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    if (!fishsticks.serverQueue) {
        msg.reply("There is nothing playing!");
    }

    return msg.channel.send(`**Now Playing**: ${fishsticks.serverQueue.songs[0].title}`);
}