const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_ids.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

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

}