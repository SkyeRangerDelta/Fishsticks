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
    }
    else {
        msg.member.addRole(pubg);
        msg.reply("Overwatch Role Assigned.").then(sent => sent.delete(10000));
    }
}