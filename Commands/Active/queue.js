const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_ids.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //HALT - COMMAND DISABLED UNTIL REPAIRED
    const embeds = require('../embeds/main.json');

    syslog("Command attempted - halted due to defective state.", 3);

    let defective = new Discord.RichEmbed();
        defective.setTitle("o0o - Command Defective - o0o");
        defective.setColor(config.fscolor);
        defective.setDescription(embeds.commands.defective);
        defective.addField("Reason:", "Command is not finished. Library modules, API syncs, and Fishsticks' interaction are not agreeing with each other.", true);

    return msg.reply({embed: defective}).then(sent => sent.delete(15000));

    /*

    var logger = fishsticks.channels.get(chs.musiclog);

    if (!fishsticks.serverQueue) {
        msg.reply("There's nothing playing!");
        return;
    }

    var queueInfoPanel = new Discord.RichEmbed();
        queueInfoPanel.setTitle("o0o - Player Queue - o0o");
        queueInfoPanel.setColor(config.fscolor);
        queueInfoPanel.setDescription(
            `${fishsticks.serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}`
        );
        queueInfoPanel.addField("Now Playing", `${fishsticks.serverQueue.songs[0].title}`, true);

    logger.send({embed: queueInfoPanel});
    return;

    */

}