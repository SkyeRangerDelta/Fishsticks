const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {

    if (msg.content.length > 5) return;

    msg.channel.send("Hi There!")    
}