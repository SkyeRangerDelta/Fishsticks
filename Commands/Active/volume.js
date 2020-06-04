const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_ids.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    //HALT - COMMAND DISABLED UNTIL REPAIRED
    const embeds = require('../embeds/main.json');

    syslog("Command attempted - halted due to defective state.", 3);

    let defective = new Discord.MessageEmbed();
        defective.setTitle("o0o - Command Defective - o0o");
        defective.setColor(config.fscolor);
        defective.setDescription(embeds.commands.defective);
        defective.addField("Reason:", "Command is not finished. Library modules, API syncs, and Fishsticks' interaction are not agreeing with each other.", true);

    return msg.reply({embed: defective}).then(sent => sent.delete({timeout: 15000}));

    /*

    var logger = fishsticks.channels.cache.get(chs.musiclog);
    
    if (msg.member.voiceChannel != fishsticks.vc) {
        msg.reply("Who are you? You're not even in the same channel as me!");
    }
    else {
        if ((msg.member.roles.find('name', 'CC Member')) || (msg.member.roles.find('name', 'ACC Member')) || (msg.member.roles.find('name', 'Staff'))) {

            if (!fishsticks.serverQueue) {
                msg.reply("There's nothing to stop!");
                return;
            }

            if (cmd[0] == null) {
                logger.send("**Current Volume**: `" + fishsticks.serverQueue.volume + "`.");
            }
            else {

                fishsticks.serverQueue.volume = cmd[0];
                fishsticks.serverQueue.connection.dispatcher.setVolumeLogarithmic(cmd[0] / 5);

                return logger.send("**Volume set to**:`" + fishsticks.serverQueue.volume + "` by " + msg.author.tag);
            }
        }
        else {
            msg.reply("Are you qualified to run this thing?");
        }
    }

    */
}