const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');
const eng = require('../Modules/fishsticks_engm.json');
const sys = require('../Modules/Core/coresys.json');
const ses = require('../fishsticks_vars.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var status = new Discord.RichEmbed();
			status.setTitle("o0o - FISHSTICKS STATUS REPORT - o0o");
			status.setColor(config.fscolor);
			status.setDescription(
				"Current variables listing in this Fishsticks session.\n"+
				"-----------------------------------------------\n"+
				"File Read Syst: ``Online``" + "\n"+
				"Active External Files: `16`\n"+
				"Active External Directories: `4`\n"+
				"Session Number: ``" + fishsticks.syssession + "``\n"+
				"Version Number: ``" + sys.fsversion + "``\n" +
				"Engineering Mode: ``" + eng.engmode + "``\n"+
				"Online Temporary Channels: `" + fishsticks.tempChannels.length + "`.\n" +
				"Echo System: `Online`\n" +
				"Bot Identifier: ``8663``\n\n"+
				"``This message will delete itself in 1 minute.``"
			);

    msg.channel.send({embed: status}).then(sent => sent.delete(30000));
}