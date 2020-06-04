const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    var rules = new Discord.MessageEmbed();
			rules.setTitle("o0o - CC DISCORD RULES - o0o")
			rules.setColor(config.fsemercolor)
			rules.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
			rules.setDescription(
				"1. Follow all General Conduct Rules\n" +
				"2. Be respectful of others. If someone does not like your behavior, stop or go to a new channel.\n"+
				"3. Please only stream or record in a channel after obtaining permission from others in the channel to do so.\n\n"+
				"===============================================\n"+
				"**General Conduct Rules**:\n"+
				"A. Be respectful to others, their personhood, beliefs, gender, race, nationality, disability, or any other way they may differ from you. (Matthews 7:12)\n"+
				"B. Obey all laws and end user agreements. (No sharing or talking about pirated software whatsoever. Fishsticks will have your head.) Romans 13:8\n"+
				"C. If you feel someone to be guilty of any wrong doing, please talk to them privately or not at all (`!report` is a thing too.) Matthew 18:15\n"+
                "D. Please refrain from advertising or recruiting for anything without prior approval.\n\n"+
                "`This message will delete itself in 1 minute.`"
			)

    msg.channel.send({embed: rules}).then(sent => sent.delete({timeout: 60000}));
}