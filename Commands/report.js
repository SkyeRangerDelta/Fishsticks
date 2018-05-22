const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const chs = require('../Modules/fs_channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.roles.find("name", "Members") || msg.member.roles.find("name", "Staff")) {

        var type = cmd.splice(1, 1);
        var target = cmd.splice(1,1);
        var reason = cmd.splice(1).join(' ');

        var techRole = msg.guild.roles.find('name', 'Tech Support');
        var staffRole = msg.guild.roles.find('name', 'Staff');

        var staffChannel = fishsticks.channels.get(chs.staffChannel);

        console.log("[SERV-REP] Report attempted by " + msg.author.tag + "...");

        //EMBEDS
        //Server
        var serverReport = new Discord.RichEmbed();
            serverReport.setTitle("o0o - SERVER ISSUE REPORT - o0o");
            serverReport.setColor(config.fsemercolor);
            serverReport.setDescription(
                "A report has been issued by " + msg.author.tag + " concerning the server " + target + ".\n" +
                "Reason: " + reason + ".\n" +
                techRole
            );

        //Conduct
        var conductReport = new Discord.RichEmbed();
            conductReport.setTitle("o0o - MEMBER CONDUCT REPORT - o0o");
            conductReport.setColor(config.fsemercolor);
            conductReport.setDescription(
                "A report has been issued by " + msg.author.tag + " concerning the memer " + target + ".\n" +
                "Reason: " + reason + ".\n" +
                staffRole
            );

        //Discord
        var discordReport = new Discord.RichEmbed();
            discordReport.setTitle("o0o - DISCORD SERVER REPORT - o0o");
            discordReport.setColor(config.fsemercolor);
            discordReport.setDescription(
                "A report has been issued by " + msg.author.tag + "concerning a problem with Discord.\n" +
                "Reason: " + reason + ".\n"+
                techRole
            );

        switch (type) {
            case "server":
                msg.reply().then(sent => sent.delete(15000));

                staffChannel.send({embed: serverReport});
            break;
            case "conduct":
                msg.reply().then(sent => sent.delete(15000));

                staffChannel.send({embed: conductReport});
            break;
            case "discord":
                msg.reply().then(sent => sent.delete(15000));

                staffChannel.send({embed: discordReport});
            break;
            default:
                msg.reply("The report failed to file because you did something wrong parameter wise. Consider reviewing `!info report` and then trying again.").then(sent => sent.delete(15000));
            break;
        }
    }
}