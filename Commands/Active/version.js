const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const coresys = require('../../Modules/Core/coresys.json');

exports.run = (fishsticks, msg, cmd) => {
	msg.delete();
	
	function fetchStatus() {
		if (fishsticks.subroutines.get("online")) {
			return "`Online`";
		}
		else {
			return "`Offline`";
		}
	}

    var version = new Discord.RichEmbed();
			version.setTitle("o0o - FISHSTICKS VERSION REPORT - o0o")
			version.setColor(config.fscolor)
			version.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
			version.setDescription("This contains information regarding Fishsticks' current version and where to find out more concerning his structure.")
			version.addField("Version: ", "V" + fishsticks.version);
			version.addField("Current Status: ", fetchStatus());
			version.addField("Fishsticks' GitHub Repository: ", "[Official Fishsticks Repo](https://github.com/SkyeRangerDelta/Fishsticks)");
			version.addField("Complete Fishsticks Guide: ", "[KBase Article](https://forums.ccgaming.com/kb/viewarticle?a=3)");
			version.addField("Note", "`This message will delete itself in 30 seconds.`")

    msg.channel.send({embed: version}).then(sent => sent.delete(30000));
}