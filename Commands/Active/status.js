const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const eng = require('../../Modules/fishsticks_engm.json');
const sys = require('../../Modules/Core/coresys.json');
const ses = require('../../fishsticks_vars.json');
const fssys = require('fs');

const actDir = './Commands/Active';
const pasDir = './Commands/Passive';

exports.run = (fishsticks, msg, cmd) => {
	msg.delete();

	let engmode = fishsticks.engmode;

	var activeDirs = 0;
	var passiveDirs = 0;
	var externalDirs = "`Under Development`";

	fssys.readdir(actDir, (err, files) => {
		activeDirs = files.length;
	}).on(console.error("[STAT-REP] Active Error:\n" + err));

	fssys.readdir(pasDir, (err, files) => {
		passiveDirs = files.length;
	}).on(console.error("[STAT-REP] Passive Error:\n" + err));
	
	if (engmode == true) {
		var statusENG = new Discord.RichEmbed();
		statusENG.setTitle("o0o - FISHSTICKS STATUS REPORT - o0o");
		statusENG.setColor(config.fscolor);
		statusENG.setDescription(
			"Current variables listing in this Fishsticks session.\n"+
			"-----------------------------------------------\n"+
			"File Read Syst: ``Limited``" + "\n"+
			"Registered Server Status: `" + fishsticks.servStatus + "`\n" +
			"Active External Directories: `" + externalDirs + "`\n"+
			"Active External Active Commands: `" + activeDirs + "`\n"+
			"Active External Passive Commands: `" + passiveDirs + "`\n"+
			"Session Number: ``" + fishsticks.syssession + "``\n"+
			"Attempted Commands: " + fishsticks.commandAttempts + "\n"+
			"Successful Commands: " + fishsticks.commandSuccess + "\n"+
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
			"Registered Server Status: `" + fishsticks.servStatus + "`\n" +
			"Active External Directories: `" + externalDirs + "`\n"+
			"Active External Active Commands: `" + activeDirs + "`\n"+
			"Active External Passive Commands: `" + passiveDirs + "`\n"+
			"Session Number: ``" + fishsticks.syssession + "``\n"+
			"Attempted Commands: " + fishsticks.commandAttempts + "\n"+
			"Successful Commands: " + fishsticks.commandSuccess + "\n"+
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