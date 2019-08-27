//----USER INFO----

const Discord = require('discord.js');
const sys = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (!msg.member.roles.find("name", "Staff")) {
        return msg.reply("This is a staff command only!").then(sent => sent.delete(10000));
    }

    let user = msg.mentions.users.first();

    if (user == null || user == undefined) {
        return msg.channel.send("I don't have those records on file...").then(sent => sent.delete(10000));
    }

    let uClient = user.client;

    let created = user.createdAt;
    let timeCreated = user.createdTimestamp;
    let isBot = convertBool(user.bot);
    let lastMsg = user.lastMessage;

    let reportEmbed = new Discord.RichEmbed();
        reportEmbed.setColor(sys.fscolor);
        reportEmbed.setFooter("User Info for " + user.username + " summoned by " + msg.author.username + ". Auto-Delete in 30s.");
        reportEmbed.setTitle("o0o - User Info Report - o0o");
        reportEmbed.setThumbnail(user.avatarURL);
        reportEmbed.setDescription("**Name**: " + user.username + "\n**Tag**: " + user.tag + "\n**Created**: " + created + "\n**Bot?** " + isBot + "\n**Last message**: `" + lastMsg + "`.");;
        reportEmbed.addField("Current Status", uClient.status, true);
        reportEmbed.addField("In Browser? ", convertBool(uClient.browser), true);
        reportEmbed.addField("Ping", uClient.ping, true);
        reportEmbed.addField("Uptime", uClient.uptime + "ms", true);

    msg.channel.send("Here are those files you asked for...", {embed: reportEmbed}).then(sent => sent.delete(30000));

    function convertBool(state) {
        if (state) {
            return "Yes";
        } else {
            return "No";
        }
    }
}