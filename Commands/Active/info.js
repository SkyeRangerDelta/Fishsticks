const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const embeds = require('../embeds/main.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();
    
    let entry = cmd[0];

    msg.channel.send(`See the full documentation of this command and history at:\nhttps://wiki.pldyn.net/fishsticks/command-listing#${entry}`).then(sent => sent.delete(15000));
}