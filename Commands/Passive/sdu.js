const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("*In the criminal justice system, bot based offenses are considered especially heinous. In this Discord, the dedicated detectives who investigate these vicious felonies are members of an elite squad known as the Special Developers Unit. These are their stories.* GLUNG GLUNG", {files: ["./images/fs_defense.png"]});
}