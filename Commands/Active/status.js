const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const eng = require('../../Modules/fishsticks_engm.json');
const sys = require('../../Modules/Core/coresys.json');
const ses = require('../../fishsticks_vars.json');
const fssys = require('fs');

const subroutines = require('../../Modules/Functions/subRoutines.js');

const actDir = './Commands/Active';
const pasDir = './Commands/Passive/';
const botDir = './';

exports.run = (fishsticks, msg, cmd) => {
	msg.delete();

	subroutines.run(fishsticks);

	let engmode = fishsticks.engmode;

	let activeDirs = 0;
	let passiveDirs = 0;
	var externalDirs = 0;

	if (fishsticks.CCGuild.available) {
		fishsticks.servStatus = "Online";
	}
	else {
		fishsticks.servStatus = "Potential Outage";
	}

	fssys.readdir(actDir, (err, files) => {
		if (err) throw err;
		activeDirs = files.length;

		fssys.readdir(pasDir, (err, files) => {
			if (err) throw err;
			passiveDirs = files.length;

			fssys.readdir(botDir, (err, files) => {
				if (err) throw err;
				externalDirs = files.length;


				function evalRoutine(routine) {
					if (fishsticks.subroutines.get(routine)) {
						return "`Online`";
					}
					else {
						return "`Offline`";
					}
				}

				if (engmode == true) {
					var statusENG = new Discord.RichEmbed();
					statusENG.setTitle("o0o - FISHSTICKS STATUS REPORT - o0o");
					statusENG.setColor(config.fscolor);
					statusENG.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
					statusENG.setDescription(
						"Current variables listing in this Fishsticks session.\n"+
						"-----------------------------------------------\n"+
						"Registered Server Status: `" + fishsticks.servStatus + "`\n"+
						"Session Number: `" + fishsticks.syssession + "`\n"+
						"Version: `" + sys.fsversion + "`\n"+
						"Bot Tag: " + "`Fishsticks#8663`" + "\n"+
						"File Read System: " + "`Online`" + "\n"+
						"Online Directories: `" + externalDirs + "`\n"+
						"Online Active Commands: `" + activeDirs + "`\n"+
						"Online Passive Commands: `" + passiveDirs + "`\n"+
						"Successful Commands: `" + fishsticks.commandSuccess + "`\n"+
						"Attempted Commands: `" + fishsticks.commandAttempts + "`\n\n"+
						"**__Subroutines__**\n"+
						"**Engineering Mode**: " + evalRoutine("engm")
					);
					statusENG.addField("__Twitch Screen:__", evalRoutine("twitch"), true);
					statusENG.addField("__Music Player:__", evalRoutine("musi"), true);
					statusENG.addField("__Echo Announcer:__", evalRoutine("echo"), true);
					statusENG.addField("__MattyB Filter:__", evalRoutine("matb"), true);
					statusENG.addField("__Active Command Systems:__", evalRoutine("active"), true);
					statusENG.addField("__Passive Command Systems:__", evalRoutine("passive"), true);
					statusENG.addField("__Vouch System__", evalRoutine("vouch"), true);
					statusENG.addField("__N. Link Screen__", evalRoutine("nlinkscn"), true);
					statusENG.addField("__Poll System__", evalRoutine("poll"), true);
					statusENG.addBlankField();
					statusENG.addField("System Efficiency: ", fishsticks.eff + "%");
			
					msg.channel.send({embed: statusENG}).then(sent => sent.delete(45000));
				}
				else {
					var status = new Discord.RichEmbed();
					status.setTitle("o0o - FISHSTICKS STATUS REPORT - o0o");
					status.setColor(config.fscolor);
					status.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
					status.setDescription(
						"Current variables listing in this Fishsticks session.\n"+
						"-----------------------------------------------\n"+
						"Registered Server Status: `" + fishsticks.servStatus + "`\n"+
						"Session Number: `" + fishsticks.syssession + "`\n"+
						"Version: `" + sys.fsversion + "`\n"+
						"Bot Tag: `" + "`Fishsticks#8663`" + "`\n"+
						"File Read System: " + "`Online`" + "\n"+
						"Online Directories: `" + externalDirs + "`\n"+
						"Online Active Commands: `" + activeDirs + "`\n"+
						"Online Passive Commands: `" + passiveDirs + "`\n"+
						"Successful Commands: `" + fishsticks.commandSuccess + "`\n"+
						"Attempted Commands: `" + fishsticks.commandAttempts + "`\n\n"+
						"**__Subroutines__**\n"+
						"**Engineering Mode**: " + evalRoutine("engm")
					);
					status.addField("__Twitch Screen:__", evalRoutine("twitch"), true);
					status.addField("__Music Player:__", evalRoutine("musi"), true);
					status.addField("__Echo Announcer:__", evalRoutine("echo"), true);
					status.addField("__MattyB Filter:__", evalRoutine("matb"), true);
					status.addField("__Active Command Systems:__", evalRoutine("active"), true);
					status.addField("__Passive Command Systems:__", evalRoutine("passive"), true);
					status.addField("__Vouch System__", evalRoutine("vouch"), true);
					status.addField("__N. Link Screen__", evalRoutine("nlinkscn"), true);
					status.addField("__Poll System__", evalRoutine("poll"), true);
					status.addBlankField();
					status.addField("System Efficiency: ", fishsticks.eff + "%");
			
					msg.channel.send({embed: status}).then(sent => sent.delete(45000));
				}
			});
		});
	});
}