const Discord = require('discord.js');
const sys = require('../Modules/Core/coresys.json');
const fs = require('fs');

let engmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let overwatch = msg.guild.roles.find('name', 'Overwatch');
    if (msg.member.roles.find('name', 'Overwatch')) {
        msg.member.removeRole(overwatch);
        msg.reply("Overwatch Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Overwatch removed from " + msg.author.tag);
    }
    else {
        msg.member.addRole(overwatch);
        msg.reply("Overwatch Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Overwatch assigned to " + msg.author.tag);
    }
}