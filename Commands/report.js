const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const chs = require('../Modules/fs_channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (msg.member.roles.find("name", "Members") || msg.member.roles.find("name", "Staff")) {

        var type = cmd[0];
        var target = cmd[1];
        var reason = cmd.splice(2).join(' ');

        var techRole = msg.guild.roles.find('name', 'Tech Support');
        var staffRole = msg.guild.roles.find('name', 'Staff');

        var staffChannel = fishsticks.channels.get(chs.staffChannel);

        console.log("[SERV-REP] Report attempted by " + msg.author.tag + "...");
        console.log("\tType: " + type + "\n\tTarget: " + target + "\n\tReason: " + reason);

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
                "A report has been issued by " + msg.author.tag + " concerning the member " + target + ".\n" +
                "Reason: " + reason + ".\n" +
                staffRole
            );

        //Discord
        var discordReport = new Discord.RichEmbed();
            discordReport.setTitle("o0o - DISCORD SERVER REPORT - o0o");
            discordReport.setColor(config.fsemercolor);
            discordReport.setDescription(
                "A report has been issued by " + msg.author.tag + " concerning a problem with Discord.\n" +
                "Reason: " + reason + ".\n" +
                techRole
            );

        if (type == "server" || type == "Server") {
            msg.reply("Report filed!").then(sent => sent.delete(15000));

            staffChannel.send({embed: serverReport});
        }
        else if (type == "conduct" || type == "Conduct") {
            msg.reply("Report filed!").then(sent => sent.delete(15000));

            staffChannel.send({embed: conductReport});
        }
        else if (type == "discord" || type == "Discord") {
            msg.reply("Report filed!").then(sent => sent.delete(15000));

            staffChannel.send({embed: discordReport});
        }
        else {
            msg.reply("The report failed to file because you did something wrong parameter wise. Consider reviewing `!info report` and then trying again.").then(sent => sent.delete(15000));
        }
    }
}