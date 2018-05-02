const Discord = require('discord.js');
const sys = require('../Modules/Core/coresys.json');
const fs = require('fs');

let engmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let rtlg = msg.guild.roles.find('name', 'Rocket League');
    if (msg.member.roles.find('name', 'Rocket League')) {
        msg.member.removeRole(rtlg);
        msg.reply("PUBG Role Removed.").then(sent => sent.delete(10000));
    }
    else {
        msg.member.addRole(rtlg);
        msg.reply("PUBG Role Assigned.").then(sent => sent.delete(10000));
    }
}