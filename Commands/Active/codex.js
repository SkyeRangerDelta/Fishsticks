const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const colors = require('colors');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    let entry = cmd[0];
    console.log(colors.blue("[CODEX] Attempting to find a codex entry " + entry));

    msg.reply(`WORD OF WARNING: This command is under maintenance. The link below will work, but won't link to it's proper section if you have the command ID wrong.`).then(sent => sent.delete({timeout: 10000}));
    msg.channel.send(`That entry can be found here: https://wiki.pldyn.net/fishsticks/command-listing#${entry}`).then(sent => sent.delete({timeout: 15000}));

    fishsticks.commandAttempts++;
    fishsticks.commandSuccess++;
}