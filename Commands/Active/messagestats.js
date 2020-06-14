//MessageStats
const Discord = require('discord.js');

const messageStats = require('../../Modules/messageStats.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("Crunching numbers, standby...").then(sent => sent.delete(5000));

    //Current date
	let systemDate = new Date();
    let currentDate = `${systemDate.getMonth()}/${systemDate.getDate()}/${systemDate.getFullYear()}`;
    
    //Prior counts
    let countTotals = "";

    for (let [key, value] of Object.entries(messageStats)) {
        countTotals = countTotals.concat(`**${key}**: Total (${value.totalMessages}), Average/User (${value.avgMessagesToday})\n`);
    }
    
    if (!messageStats[currentDate]) {
        return msg.reply("Today's stats don't exist yet!");
    } else {
        let msgStatsPanel = new Discord.RichEmbed();
            msgStatsPanel.setTitle("o0o - Message Stats - o0o");
            msgStatsPanel.setDescription("Number crunch for every message sent today - " + currentDate);
            msgStatsPanel.addField("Messages Sent Today", messageStats[currentDate].totalMessages, true);
            msgStatsPanel.addField("Average Messages/User Today", messageStats[currentDate].avgMessagesToday, true);
            msgStatsPanel.addField("Message Totals Sent Previously", countTotals);
            msgStatsPanel.setFooter("Message will self-delete in 20 seconds. Panel was summoned by " + msg.member.nickname);

        msg.channel.send({embed: msgStatsPanel}).then(sent => sent.delete(20000));
    }
}