const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var musichelp = new Discord.RichEmbed();
        musichelp.setTitle("o0o - MUSIC PLAYER HELP - o0o");
        musichelp.setColor(config.fscolor);
        musichelp.setDescription(
            "Need help with the music player? Look below!\n"+
            "===============================================\n\n" +
            "`!play [youtubeLink]`: Launches Fishsticks' music player or adds a song to the queue.\n"+
            "`!stop`: Halts playback and disconnects Fishsticks.\n"+
            "`!skip`: Skips playback to the next song in the queue. (Staff only)\n"+
            "`!playing`: Shows what is currently playing.\n"+
            "`!queue`: Shows the queue of songs.\n"+
            "`!volume <value>`: Shows the current volume of the player. If issued with a value, will change the volume. (1-5 : Inclusive)\n\n"+
            "`This menu will delete itself in 45 seconds.`"
        );

    if (msg.member.roles.find("name", "Members")) {
        msg.channel.send({embed: musichelp}).then(sent => sent.delete(45000));
    }
    else {
        msg.reply("You need to be a member to use the music player!").then(sent => sent.delete(10000));
    }

    
}