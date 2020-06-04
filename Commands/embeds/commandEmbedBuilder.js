let Discord = require('discord.js');
let config = require('../../Modules/Core/corecfg.json');

exports.run = (title, color, syntaxBuilder, description) => {

    var embedDescriptor = "**__Syntax__**\n";

    let paramText = "";
    let exceptText = "";

    //Handle Syntax
    embedDescriptor = embedDescriptor + syntaxBuilder.syntax;

    //Handle Parameters
    for (param in syntaxBuilder.params) {
        paramText = paramText + "\n->" + syntaxBuilder.params[param];
    }

    //Handle Exceptions
    for (except in syntaxBuilder.exceptions) {
        exceptText = exceptText + "\n->" + syntaxBuilder.exceptions[except];
    }

    var embed = new Discord.MessageEmbed();
        embed.setTitle("o0o - CODEX [" + title + "] - o0o");
        embed.setColor(color);
        embed.setDescription(embedDescriptor + "\n\n__**Parameters**__" + paramText);
        embed.addField("Command Description", description);
        embed.addField("Exceptions", exceptText);

    return embed;

}