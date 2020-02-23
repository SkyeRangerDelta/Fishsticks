const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {

    if (msg.content.length > 10) return;

    msg.channel.send("Mmmm, fishsticks....", {files: ["./images/fsimg.jpg"]});
}