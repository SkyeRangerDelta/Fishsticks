const Discord = require('discord.js');

let mattybmode;

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

    if (msg.member.roles.find('name', 'Recognized') || msg.member.roles.find('name', 'Staff')) {

        mattybmode = !mattybmode;
        fishsticks.subroutines.set("matb", mattybmode);

        console.log("[MTB-MODE] Toggled to " + mattybmode + " by " + msg.author.tag);
        msg.reply("Music Player: MattyB Mode has been toggled " + mattybmode + ".").then(sent => sent.delete({timeout: 10000}));
    }
    else {
        msg.reply("How dare you challenge me with your primitive powers...begone!").then(sent => sent.delete({timeout: 10000}));
    }

    */
}