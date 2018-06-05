const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var links = new Discord.RichEmbed();
			links.setTitle("o0o - CC GAMING LINKS - o0o")
			links.setColor(config.fscolor)
			links.setDescription(
				"[CC Gaming Website](https://www.ccgaming.com)\n" +
				"[CC Forums](https://forums.ccgaming.com)\n\n" +
				"[Skye's Definitive Guide to Discord](https://forums.ccgaming.com/viewtopic.php?f=2&t=24357)\n\n"+
				"``This message will delete itself in 30 seconds.``")

    msg.channel.send({embed: links}).then(sent => sent.delete(30000));
}