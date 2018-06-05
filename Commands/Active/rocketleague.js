const Discord = require('discord.js');
const sys = require('../../Modules/Core/coresys.json');
const fs = require('fs');

let engmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let rtlg = msg.guild.roles.find('name', 'Rocket League');
    if (msg.member.roles.find('name', 'Rocket League')) {
        msg.member.removeRole(rtlg);
        msg.reply("Rocket League Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Rocket League removed from" + msg.author.tag);
    }
    else {
        msg.member.addRole(rtlg);
        msg.reply("Rocket League Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Rocket League assigned to " + msg.author.tag);
    }
}