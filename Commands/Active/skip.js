const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var logger = fishsticks.channels.get(chs.musiclog);

    if (msg.member.voiceChannel != fishsticks.vc) {
        msg.reply("Who are you? You're not even in the same channel as me!");
    }
    else {
        if (msg.member.roles.find('name', 'Staff')) {

            if (!fishsticks.serverQueue) {
                msg.reply("There's nothing to skip!");
            }
            else {
                var skipInfoPanel = new Discord.RichEmbed();
                    skipInfoPanel.setTitle("o0o - SKIP - o0o");
                    skipInfoPanel.setColor(config.fscolor);
                    skipInfoPanel.setDescription(
                        "Playback skipped a song. Authorized by " + msg.author.tag + "\n"+
                        `**Now Playing**: ${fishsticks.serverQueue.songs[0].title}`
                    )

                fishsticks.serverQueue.connection.dispatcher.end();

                console.log("[MUSI-SYS] Playback skipped a song by " + msg.author.tag);
                logger.send({embed: skipInfoPanel});
            }
        }
        else {
            msg.reply("Are you qualified to run this thing?");
        }
    }
}