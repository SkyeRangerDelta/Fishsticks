const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const eng = require('../Modules/fishsticks_engm.json');
const sys = require('../Modules/Core/coresys.json');
const ses = require('../fishsticks_vars.json');

exports.run = (fishsticks, msg, cmd) => {
	msg.delete();

	let engmode = fishsticks.engmode;
	
	if (engmode == true) {
		var statusENG = new Discord.RichEmbed();
		status.setTitle("o0o - FISHSTICKS STATUS REPORT - o0o");
		status.setColor(config.fscolor);
		status.setDescription(
			"Current variables listing in this Fishsticks session.\n"+
			"-----------------------------------------------\n"+
			"File Read Syst: ``Limited``" + "\n"+
			"Active External Files: `18`\n"+
			"Active External Directories: `6`\n"+
			"Session Number: ``" + fishsticks.syssession + "``\n"+
			"Version Number: ``" + sys.fsversion + "``\n" +
			"Engineering Mode: ``" + engmode + "``\n"+
			"Online Temporary Channels: `" + fishsticks.tempChannels.length + "`.\n" +
			"Passive Systems: `Online`\n" +
			"Twitch Screen: `Online`\n" +
			"Echo System: `Offline in ENGM`\n" +
			"Bot Identifier: ``8663``\n\n"+
			"``This message will delete itself in 1 minute.``"
		);

		msg.channel.send({embed: statusENG}).then(sent => sent.delete(30000));
	}
	else {
		var status = new Discord.RichEmbed();
		status.setTitle("o0o - FISHSTICKS STATUS REPORT - o0o");
		status.setColor(config.fscolor);
		status.setDescription(
			"Current variables listing in this Fishsticks session.\n"+
			"-----------------------------------------------\n"+
			"File Read Syst: ``Online``" + "\n"+
			"Active External Files: `18`\n"+
			"Active External Directories: `6`\n"+
			"Session Number: ``" + fishsticks.syssession + "``\n"+
			"Version Number: ``" + sys.fsversion + "``\n" +
			"Engineering Mode: ``" + engmode + "``\n"+
			"Online Temporary Channels: `" + fishsticks.tempChannels.length + "`.\n" +
			"Passive Systems: `Online`\n" +
			"Twitch Screen: `Online`\n" +
			"Echo System: `Online`\n" +
			"Bot Identifier: ``8663``\n\n"+
			"``This message will delete itself in 1 minute.``"
		);

		msg.channel.send({embed: status}).then(sent => sent.delete(30000));
	}
}