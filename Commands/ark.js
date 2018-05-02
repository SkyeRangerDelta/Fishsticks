const Discord = require('discord.js');
const sys = require('../Modules/Core/coresys.json');
const fs = require('fs');

let engmode;

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let ark = msg.guild.roles.find('name', 'Ark: SE');
    if (msg.member.roles.find('name', 'Ark: SE')) {

        msg.member.removeRole(ark);

        msg.reply("Ark Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] ARK removed from " + msg.author.tag);
    }
    else {

        msg.member.addRole(ark);

        msg.reply("Ark Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] ARK assigned to " + msg.author.tag);
    }
}