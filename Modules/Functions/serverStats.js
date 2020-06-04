//---Server Stats---
// Returns an embed to post to a channel

let Discord = require('discord.js');
let ids = require('../fs_ids.json');
let fsSettings = require('../Core/corecfg.json');
const {statusReader} = require('./shardStatus');
const {
    rewriteDate,
    rewriteDateTime
} = require('./dateTimeAgain');

module.exports = {
    simpleStats,
    fullStats
};

//Cover basic stuff
function simpleStats(fishsticks) {

    let gd_CCG = fishsticks.CCGuild;
    let ccg_GuildName = gd_CCG.name;

    let simpleStatsPanel = new Discord.MessageEmbed();
        simpleStatsPanel.setTitle(`o0o - Server Information - o0o`);
        simpleStatsPanel.setDescription(
            `Quick info on the server.`
        );
        simpleStatsPanel.addField(`Server Name`, ccg_GuildName, false);
        simpleStatsPanel.addField(`Server Launch Date`, rewriteDate(gd_CCG.createdAt), true);
        simpleStatsPanel.addField(`Server Members`, gd_CCG.memberCount, false);
        simpleStatsPanel.addField(`Server Region`, gd_CCG.region, true);
        simpleStatsPanel.setColor(fsSettings.fscolor);
        simpleStatsPanel.setFooter(`Sequence Initialized at ${rewriteDateTime(fishsticks.startTime)}`);
        simpleStatsPanel.setThumbnail(`https://pldyn.net/wp-content/uploads/2018/07/ccLogoMain.png`);

    return simpleStatsPanel;
}

//All stuff
async function fullStats(fishsticks) {

    let gd_CCG = fishsticks.guilds.cache.get(ids.guildid);
    let ccg_GuildName = gd_CCG.name;

    let fullStatsPanel = new Discord.MessageEmbed();
        fullStatsPanel.setTitle(`o0o - Server Information - o0o`);
        fullStatsPanel.setDescription(
            `Full info on the server.`
        );
        fullStatsPanel.addField(`Server Name`, ccg_GuildName, false);
        fullStatsPanel.addField(`Server Launch Date`, rewriteDate(gd_CCG.createdAt), true);
        fullStatsPanel.addField(`Server Members`, gd_CCG.memberCount, false);
        fullStatsPanel.addField(`Server Channels`, `${gd_CCG.channels.cache.size} Channels`, false);
        fullStatsPanel.addField(`Server Shard`, `ID: ${gd_CCG.shardID}\nStatus: ${statusReader(gd_CCG.shard.status)}`, true);
        fullStatsPanel.addField(`Server Region`, gd_CCG.region, true);
        fullStatsPanel.setColor(fsSettings.fscolor);
        fullStatsPanel.setFooter(`Sequence Initialized at ${rewriteDateTime(fishsticks.startTime)}`);
        fullStatsPanel.setThumbnail(`https://pldyn.net/wp-content/uploads/2018/07/ccLogoMain.png`);

    return fullStatsPanel;

}