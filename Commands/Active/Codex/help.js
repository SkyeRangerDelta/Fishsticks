const Discord = require('discord.js');
const commandEmbedBuilder = require('../../embeds/commandEmbedBuilder.js');
const config = require('../../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, entry) => {
    
    let syntaxBuilder = {
        "syntax": "!help",
        "ID": "help",
        "params": [
            "None"
        ],
        "exceptions": [
            "None"
        ]
    };

    msg.channel.send({embed: commandEmbedBuilder.run("HELP", config.fscolor, syntaxBuilder, "Help is a complete listing of all of my commands that users may execute. The come with small descriptions but if you're looking for a more detailed approach to a command...you've already found the command that will help you there.").setAuthor(msg.author.username, msg.author.avatarURL)}).then(sent => sent.delete({timeout: 20000}));
}