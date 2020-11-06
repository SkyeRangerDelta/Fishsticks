//----USER INFO----

const Discord = require('discord.js');
const sys = require('../../Modules/Core/Core_config.json');

module.exports = {
    run,
    help
};

function run(fishsticks, cmd) {
    msg.delete({timeout: 0});

    return msg.reply('Command deactivated until V18 fixes. Ask staff for support.').then(sent => sent.delete({timeout: 10000}));

    if (!msg.member.roles.find("name", "Staff")) {
        return msg.reply("This is a staff command only!").then(sent => sent.delete({timeout: 10000}));
    }

    let user = msg.mentions.users.first();

    if (user == null || user == undefined) {
        return msg.channel.send("I don't have those records on file...").then(sent => sent.delete({timeout: 10000}));
    }

    let uClient = user.client;

    let created = user.createdAt;
    let timeCreated = user.createdTimestamp;
    let isBot = convertBool(user.bot);
    let lastMsg = user.lastMessage;

    let reportEmbed = new Discord.MessageEmbed();
        reportEmbed.setColor(sys.fscolor);
        reportEmbed.setFooter("User Info for " + user.username + " summoned by " + msg.author.username + ". Auto-Delete in 30s.");
        reportEmbed.setTitle("o0o - User Info Report - o0o");
        reportEmbed.setThumbnail(user.avatarURL);
        reportEmbed.setDescription("**Name**: " + user.username + "\n**Tag**: " + user.tag + "\n**Created**: " + created + "\n**Bot?** " + isBot + "\n**Last message**: `" + lastMsg + "`.");;
        reportEmbed.addField("Current Status", uClient.status, true);
        reportEmbed.addField("In Browser? ", convertBool(uClient.browser), true);
        reportEmbed.addField("Ping", uClient.ping, true);
        reportEmbed.addField("Uptime", uClient.uptime + "ms", true);

    msg.channel.send("Here are those files you asked for...", {embed: reportEmbed}).then(sent => sent.delete({timeout: 30000}));

    function convertBool(state) {
        if (state) {
            return "Yes";
        } else {
            return "No";
        }
    }
}

function help() {
    return 'Displays a load of information about a user.';
}