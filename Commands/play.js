const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const chs = require('../Modules/fs_channels.json');

const ytdl = require('ytdl-core');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    const memberVC = msg.member.voiceChannel;

    var hangoutVC = fishsticks.channels.get(chs.hangoutVC);

    let engmode = fishsticks.engmode;

    console.log("[MUSI-SYS] Play command recognized from user " + msg.author.tag + ".");

    function denied() {
        console.log("[MUSI-SYS] Play command rejected.");

        msg.reply("Request denied. You have to join a tempch channel first!").then(sent => sent.delete(30000));
    }

    function accept() {
        console.log("[MUSI-SYS] Play command granted.");

        msg.reply("Request granted. Preparing song and connecting...").then(sent => sent.delete(10000));

        try {
            var connection  = await memberVC.join();
        }
        catch (error) {
            console.error(`[MUSI-SYS] Connection to channel refused: ${error}`);
            return msg.channel.send("@SkyeRangerDelta#9121 I failed to connect to a channel, check the log!");
        }

        const dispatch = connection.playStream(ytdl(cmd[1]))
            .on('end', () => {
                console.log("[MUSI-SYS] Song ended.");
                memberVC.leave();
            })
            .on('error', error => {
                console.error("[MUSI-SYS] Error Report: " + error);
            });
        
            dispatch.setVolumeLogarithmic(5 / 5);
    }

    if (msg.member.roles.find('name', 'Members')) {
        if (engmode == true) {
            console.log("[MUSI-SYS] Play command ignored via ENGM being true.")

            msg.reply("I can't play music while Engineering Mode is enabled! Ask @SkyeRangerDelta#9121 to clarify.");
        }
        else {
            if (!memberVC) {
                msg.reply("You're not attached to a voice channel silly; you can't play music if you can't hear it. :thonk:");
            }
            else if (memberVC == hangoutVC) {
                msg.reply("No no, get out of the Hangout channel. You can't play music in there.");
            }
        
            for (var t = 0; t < fishsticks.tempChannels.length; t++) {
                if (memberVC == (fishsticks.channels.get(fishsticks.tempChannels[t]))) {
                    accept();
                }
            }
        }
    }
}