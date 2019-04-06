//----PING STATS----
const Discord = require('discord.js');
const fs = require('fs');
const cfg = require('../../Modules/Core/corecfg.json');

let rolesJSON = JSON.parse(fs.readFileSync("./Modules/GameRoles/gameRoles.json", 'utf8'));

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    console.log("[GAME-ROLE] Statistics Report");

    let ping = cmd[0].replace(/[\\<>@#&!]/g, "");
    let role = msg.guild.roles.get(ping);
    let roleName = role.name;

    console.log("Command:\n\tID: " + ping + "\n\tRole Name: " + roleName);

    for (role in rolesJSON.roles) {
        if (rolesJSON.roles[role].game == roleName.toLowerCase()) {
            genReport(rolesJSON.roles[role]);
        }
    }

    function genReport(roleObj) {
        console.log("Requesting stats for " + roleName);
        console.log("Last Ping Date: " + roleObj.lastPing + "\nOfficial State: " + convertBool(roleObj.official) + "\nKnown Pings: " + roleObj.pings);

        let reportEmbed = new Discord.RichEmbed();
            reportEmbed.setTitle("o0o - Role Statistics Report - o0o");
            reportEmbed.setColor(cfg.fscolor);
            reportEmbed.setDescription("Reports are an embed that reviews the information on a role or division.");
            reportEmbed.setFooter("Report summoned by " + msg.author.username + ". Auto-delete in 30 seconds.");
            reportEmbed.addField(roleName + " Info", "**Official?**: " + convertBool(roleObj.official) + "\n**Pings**: " + roleObj.pings + "\n**Last Known Ping**: " + roleObj.lastPing);

        return msg.channel.send({embed: reportEmbed}).then(sent => sent.delete(30000));
    }

    function convertBool(state) {
        if (state) {
            return "Yes";
        } else {
            return "No";
        }
    }
}