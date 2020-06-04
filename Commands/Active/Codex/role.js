const Discord = require('discord.js');
const config = require('../../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, entry) => {
    
    let roleCodex = new Discord.MessageEmbed();
        roleCodex.setColor(config.fscolor);
        roleCodex.setTitle("o0o - CODEX [ROLE] - o0o");
        roleCodex.setFooter("Codex entry summoned by " + msg.author.username + ". Auto-delete in 30s.");
        roleCodex.setDescription("**__Syntax__**\n!role -function\n\n**__Parameters__**\n" +
            ">  **`-list`**: Shows a listing of all game roles. If not official, roles are listed with how many votes they have.\n"+
            ">>    `-divisions`: Shows a list of all the officially recognized divisions and their descriptions.\n"+
            ">  **`-join/leave -role`**: Joins or Leaves a role. Role parameter can either be name or game.\n"+
            ">  **`-show -role/division`**: Shows a detailed report of a role or division. Role can either be name or game.\n"+
            ">  **`-vote -role`**: Votes for an unofficial role. Role can either be name or game.\n"+
            ">  **`-create`**: Takes a lot of parameters to create a role.\n"+
            ">>    `-roleName`: The name of the role, ie: someone who plays TF2 might be called a Mercenary\n"+
            ">>    `-roleGame`: The game the role is associated with.\n"+
            ">>    `-division`: The division the role falls under, must be official.\n"+
            ">>    `-roleDescription`: This can describe anything about the role or game.");
        roleCodex.addField("Command Description", "The role command opens the ability to create and manipulate game roles. Created game roles start out as unofficial and must obtain 5 votes from different uses to become official. Becoming official adds it as a pingable (@role) group that users can join.");
        roleCodex.addField("Exceptions", "-> None");

    msg.channel.send({embed: roleCodex}).then(sent => sent.delete({timeout: 30000}));
}