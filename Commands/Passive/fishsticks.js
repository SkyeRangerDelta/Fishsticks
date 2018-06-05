const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.channel.send("Mmmm, fishsticks....", {files: ["./images/fsimg.jpg"]});
}