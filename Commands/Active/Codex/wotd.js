const Discord = require('discord.js');
const commandEmbedBuilder = require('../../embeds/commandEmbedBuilder.js');
const config = require('../../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, entry) => {
    
    let syntaxBuilder = {
        "syntax": "!wotd -title -scripture -verse -link",
        "ID": "wotd",
        "params": [
            "**title**: the title of the embed",
            "**scripture**: the verse to be paired",
            "**verse**: the book, chapter:verse of the scripture",
            "**link**: the .com link to the forum post"
        ],
        "exceptions": [
            "**Delimiter**: This command does not use spaces as parameter breaks - use the hyphen (`-`)."
        ]
    };

    msg.channel.send({embed: commandEmbedBuilder.run("WOTD", config.fscolor, syntaxBuilder, "Word of the Day creates an embed in a format similar to Clarence's daily posts on the forums and posts it into the channel where the command was issued.").setAuthor(msg.author.username, msg.author.avatarURL)}).then(sent => sent.delete(20000));
}