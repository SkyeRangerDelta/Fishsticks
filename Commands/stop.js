const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.voiceChannel != fishsticks.vc) {
        msg.reply("Who are you? You're not even in the same channel as me!");
    }
    else {
        if (msg.member.roles.find('name', 'Members')) {

            if (!fishsticks.serverQueue) {
                msg.reply("There's nothing to stop!");
            }
            else {
                fishsticks.serverQueue.songs = [];
                fishsticks.serverQueue.connection.dispatcher.end();
                msg.channel.send("Playback terminated by " + msg.author.tag);

                console.log("[MUSI-SYS] Playback terminated by " + msg.author.tag);
            }
        }
        else {
            msg.reply("Are you qualified to run this thing?");
        }
    }
}