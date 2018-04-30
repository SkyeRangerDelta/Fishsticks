const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const coresys = require('../Modules/Core/coresys.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var version = new Discord.RichEmbed();
			version.setTitle("o0o - FISHSTICKS VERSION REPORT - o0o")
			version.setColor(config.fscolor)
			version.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
			version.setDescription(
				"Fishsticks is currently running version " + coresys.fsversion + ".\n\n" +
				"For build information and or changelogs, check with SkyeRanger or submit a tech report.\n\n"+
				"``This message will delete itself in 20 seconds.``")

    msg.channel.send({embed: version}).then(sent => sent.delete(60000));
}