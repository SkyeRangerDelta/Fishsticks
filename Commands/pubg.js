const Discord = require('discord.js');
const sys = require('../Modules/Core/coresys.json');
const fs = require('fs');

let engmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let pubg = msg.guild.roles.find('name', 'PUBG');
    if (msg.member.roles.find('name', 'PUBG')) {
        msg.member.removeRole(pubg);
        msg.reply("PUBG Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] PUBG removed from " + msg.author.tag);
    }
    else {
        msg.member.addRole(pubg);
        msg.reply("PUBG Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] PUBG assigned to " + msg.author.tag);
    }
}