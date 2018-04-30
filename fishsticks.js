//======================================
//"FISHSTICKS" - OFFICIAL CC DISCORD BOT
//======================================

//--------------------------------------
//..........SYSTEM VARIABLES............
//--------------------------------------
//CONSTANT DECLARATIONS
const Discord = require("discord.js");
const fs = require('fs');
const fishsticks = new Discord.Client();

const systems = require('./Modules/fs_systems.json');
const sys = require('./Modules/Core/coresys.json');
const channels = require('./Modules/fs_channels.json');
const config = require('./Modules/Core/corecfg.json');

const token = systems.token;
const fscolor = config.fscolor;
const prefix = config.prefix;

//ENGINEERING MODE
let engmode = false;

fishsticks.tempChannels = [];
fishsticks.version = sys.fsversion;

var announceChannel;
var fstempchclone;
var staffChannel;

//--------------------------------------
//............MAIN SCRIPT...............
//--------------------------------------
//SESSION/ENGM MANAGER
var fsvarsdoc = JSON.parse(fs.readFileSync('./fishsticks_vars.json', 'utf8'));
var fs_session = fsvarsdoc.sessionnum++;
fishsticks.syssession = fs_session;

fs.writeFileSync("./fishsticks_vars.json", JSON.stringify(fsvarsdoc));

var fsengmdoc = JSON.parse(fs.readFileSync('./Modules/fishsticks_engm.json', 'utf8'));
engmode = fsengmdoc.engmode;
fishsticks.engmode = engmode;

//VOUCH FILE SYSTEM (that does nothing...)
var fsvouchesdoc = JSON.parse(fs.readFileSync('./fishsticks_vouches.json', 'utf8'));

//STARTUP PROCEDURE
fishsticks.on('ready', () => {
	const fsconsoleChannel = fishsticks.channels.get(channels.fsconsole);
	announceChannel = fishsticks.channels.get('125825436650307584');
	staffChannel = fishsticks.channels.get('140153900996100097');

	//Startup Message - console
	console.log(`Successfully Logged ${fishsticks.user.tag} into the server.`);
	console.log("Initialized and booted Fishsticks version " + fishsticks.version);
	console.log("===========================================================");
	console.log("[SESSION#] " + fishsticks.syssession);
	console.log("[ENG-MODE] Currently: " + engmode)

	//Startup Message - Discord
	if (engmode == true) {
		fishsticks.user.setActivity('ENGM Enabled! | !help');
	} else {
		fishsticks.user.setActivity("!help | V" + fishsticks.version);
	}

	var startupseq = new Discord.RichEmbed();
		startupseq.setTitle("o0o - FISHSTICKS STARTUP - o0o")
		startupseq.setColor(fscolor);
		startupseq.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
		startupseq.setDescription(
			"Dipping in flour...\n" +
			"Baking at 400°...\n" +
			"Fishsticks V" + fishsticks.version + " is ready to go!")

	fsconsoleChannel.send({embed: startupseq}).catch(console.error).then(sent => sent.delete(30000));



});

//----------------------------------
//FISHSTICKS COMMAND LISTING
//----------------------------------

//RICH EMBEDS
	//Channels 
	/*
	
	//Help
	var help = new Discord.RichEmbed();
		help.setTitle("o0o - FISHSTICKS HELP - o0o")
		help.setColor(fscolor)
		help.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
		help.setDescription(
			"Hi there, looking for a command to use? See below:\n" + 
			"===============================================\n\n" +
			"**Normal Commands**\n" +
			"-----------------------------------------------\n" +
			"``!channels``: Displays description for all the channels!\n"+
			"``!divisions``: Lists the official CC Divisions and their leaders.\n"+
			"``!hello``: Says hello!\n" +
			"``!help``: Displays this menu.\n" +
			"``!hi``: Hey yourself!\n"+
			"``!ips``: Displays Official CC Server IP addresses\n"+
			"``!links``: Provides a list of useful links.\n" +
			"``!roles``: Lists all the roles and their descriptions.\n" +
			"``!rules``: Shows the rules of the CC Discord server.\n" +
			"``!version``: Fishsticks version report.\n" +
			"``!status``: Displays current running information for Fishsticks.\n\n" +
			"**CC Member Commands**\n"+
			"-----------------------------------------------\n" +
			"``!report [type] [target] [reason]``: report a problem to the necessary member.\n"+
			"  --> ``!info-report``: Details on how to use ``!report``.\n" +
			"``!tempch [max users <0 if none>] [name]``: Creates a temporary channel.  You must have the CC Members, Staff, or Bot to run. Join the Channel Spawner first before running the command.\n"+
			"``*!vouch [memberID]``: When 2 verified members of CC vouch for an newcomer, they will gain the Trusted role.*\n\n"+
			"**Administrative Commands**\n" +
			"-----------------------------------------------\n" +
			"``!echo [time] [message]``: This command will take your message and broadcast it as an announcement after the specified time (in minutes) has passed.\n" +
			"``!engm``: Toggles Engineering Mode on or off depending on current state.\n\n"+
			"``This menu will delete itself in 45 seconds.``")

	//Help (Eng Mode)
	var helpeng = new Discord.RichEmbed();
		helpeng.setTitle("o0o - FISHSTICKS HELP (ENGM) - o0o")
		helpeng.setColor(fscolor)
		helpeng.setDescription(
			"Engineering mode enabled? Here are the commands you can still use:\n"+
			"===============================================\n\n" +
			"**Normal Commands**\n" +
			"-----------------------------------------------\n" +
			"``!channels``: Displays description for all the channels!\n"+
			"``!divisions``: Lists the official CC Divisions and their leaders.\n"+
			"``!hello``: Says hello!\n" +
			"``!help``: Displays this menu.\n" +
			"``!hi``: Hey yourself!\n"+
			"``!ips``: Displays Official CC Server IP addresses\n"+
			"``!links``: Provides a list of useful links.\n" +
			"``!roles``: Lists all the roles and their descriptions.\n" +
			"``!rules``: Shows the rules of the CC Discord server.\n" +
			"``!version``: Fishsticks version report.\n" +
			"``!status``: Displays current running information for Fishsticks.\n\n" +
			"**CC Member Commands**\n"+
			"-----------------------------------------------\n" +
			"``!report [type] [target] [reason]``: report a problem to the necessary member.\n"+
			"  --> ``!info-report``: Details on how to use ``!report``.\n" +
			"**Administrative Commands**\n" +
			"-----------------------------------------------\n" +
			"``!engm``: Toggles Engineering Mode on or off depending on current state.\n\n"+
			"``This menu will delete itself in 45 seconds.``"
		)

	//IPS
	var ips = new Discord.RichEmbed();
		ips.setTitle("o0o - CC 'THE FISH' SERVERS - o0o")
		ips.setColor(fscolor)
		ips.setDescription(
			"You know, this is a good question\n" +
			"What are the IP addresses now?"
		);
		*/

//COMMAND STRUCTURE
	//Listed alphabetically
	//-Current List-
		//Channels
		//Divisions
		//Echo(S)
		//Engineering Mode(S)
		//Hello
		//Help
		//Hi
		//Ips
		//Links
		//Log(S)*
		//Roles
		//Rules
		//Version
		//Status
		//Temporary Voice Channel
		//Vouch

//MESSAGE AND EVENT SYSTEMS
fishsticks.on('message', async msg => {
	if (msg.author.fishsticks) return
	if (msg.author.id == fishsticks.user.id) return
	if (msg.content.indexOf(prefix) !== 0) return

	const cmd = msg.content.slice(prefix.length).trim().split(/ +/g);
	const cmdID = cmd.shift().toLowerCase();

	try {
		let cmdFile = require(`./Commands/${cmdID}.js`);
		cmdFile.run(fishsticks, msg, cmd);
	} catch (err) {
		console.error(err);
		msg.reply("You trying to thonk me? That's not a command silly. Use `!help` to get a reference.");
	}
});

/*
	//Divisions
	else if (command("divisions", msg)) {
		msg.delete();

		msg.channel.send({embed: divisions}).then(sent => sent.delete(30000));
	}

	//Echo(S)
	else if (command("echo", msg)) {

		if (msg.member.roles.find("name", "Staff") || msg.member.roles.find("name", "Bot")) {
			
			if (engmode == false) {

				var splitCmd = msg.content.split(" ");

				var waitTime = splitCmd.splice(1, 1);

				var keepMsg = splitCmd.splice(1).join(' ');

				var alttime = waitTime * 60;
				alttime = alttime * 1000;

				console.log(keepMsg);

				msg.delete();

				console.log("[ECHO-CMD]: " + waitTime + " minute(s): " + keepMsg);
				msg.reply("Command received. Awaiting " + waitTime + " minute(s) to respond.").then(sent => sent.delete(10000));

				setTimeout(echofunc, alttime, "@everyone " + keepMsg);
			}
			else {
				msg.reply("Engineering Mode is enabled. Turn it off before using this command!").then(sent => sent.delete(15000));
			}
		}
		else {
			msg.reply("You don't have the correct permissions!").then(sent => sent.delete(15000));
		}
	}

	//Engineering Mode(S)
	else if (command("engm", msg)) {

		msg.delete();

		if (msg.member.roles.find("name", "Staff") || msg.member.roles.find("name", "Bot")) {

			engmode = !engmode;

			console.log("[ENG-MODE] Toggled to " + engmode + " by: " + msg.author.tag);

			msg.reply("Engineering Mode is now: " + engmode + ".").then(sent => sent.delete(15000));

			fsconsoleChannel.send("Fishsticks Engineering Mode has been toggled to " + engmode + " by: " + msg.author).then(sent => sent.delete(15000));

			if (engmode == true) {
				fishsticks.user.setActivity("ENGM Enabled | !help");
			}
			else {
				fishsticks.user.setActivity("!help | V" + fsbuild);
			}

			fsengmdoc.engmode = engmode;
			fs.writeFileSync('./fishsticks_engm.json', JSON.stringify(fsengmdoc));
		}
		else {
			msg.reply("You don't have the proper permissions to toggle Engineering Mode!").then(sent => sent.delete(15000));
		}
	}

	//Hello
	else if (command("hello", msg)) {
		msg.reply("Hello to you too!");
	}

	//Help
	else if (command("help", msg)) {
		msg.delete();

		if (engmode == true) {
			msg.channel.send({embed: helpeng}).then(sent => sent.delete(45000));
		}
		else {
			msg.channel.send({embed: help}).then(sent => sent.delete(45000));
		}
	}

	//Hi
	else if (command("hi", msg)) {
		msg.reply("Hey yourself! :P");
	}

	//Info - Report
	else if (command("info-report", msg)) {
		msg.delete();

		msg.channel.send({embed: infoReport}).then(sent => sent.delete(30000));
	}

	//Ips
	else if (command("ips", msg)) {
		msg.delete();

		msg.channel.send({embed: ips}).then(sent => sent.delete(45000));
	}

	//Links
	else if (command("links", msg)) {
		msg.delete();

		msg.channel.send({embed: links}).then(sent => sent.delete(30000));
	}

	//Report
	else if (command("report", msg)) {
		msg.delete();

		if (msg.member.roles.find("name", "Staff") || msg.member.roles.find("name", "CC Member") || msg.member.roles.find("name", "Trusted")) {

			var reportCmdSplit = msg.content.split(" ");
			var type = reportCmdSplit.splice(1, 1);
			var target = reportCmdSplit.splice(1, 1);
			var reason = reportCmdSplit.splice(1).join(' ');

			console.log("[SERV-REP] Type: " + type + "\n           Target: " + target + "\n           Reason: " + reason);

			//RICH-EMBEDS
			//Server Report
			var serverReport = new Discord.RichEmbed();
				serverReport.setTitle("o0o - SERVER ISSUE REPORT - o0o")
				serverReport.setColor(fsemercolor)
				serverReport.setDescription(
					"A report has been issued by " + msg.author + " concerning the server " + target + ".\n"+
					"Reason: " + reason + "\n" + 
					techRole
				)

			//Conduct Report
			var conductReport = new Discord.RichEmbed();
				conductReport.setTitle("o0o - MEMBER CONDUCT REPORT - o0o")
				conductReport.setColor(fsemercolor)
				conductReport.setDescription(
					"A report has been issued by " + msg.author + " concerning the behavior of " + target + ".\n"+
					"Reason: " + reason + "\n" + 
					staffRole
				)

			//Tech Report
			var techReport = new Discord.RichEmbed();
				techReport.setTitle("o0o - TS/DISCORD ISSUE REPORT - o0o")
				techReport.setColor(fsemercolor)
				techReport.setDescription(
					"A report has been issued by " + msg.author + " concerning an issue with TS or Discord.\n"+
					"Reason: " + reason + "\n"+
					techRole
				)

			if (type == "server") {
				msg.reply("The " + type + " report has been shunted to the Tech Support team and they will review the case as soon as possible. Thanks!").then(sent => sent.delete(30000));

				staffChannel.send({embed: serverReport});
			}
			else if (type == "conduct") {
				msg.reply("The " + type + " report has been shunted to Staff and will be reviewed.").then(sent => sent.delete(30000));

				staffChannel.send({embed: conductReport});
			}
			else if (type == "tech") {
				msg.reply("The " + type + " report has been shunted to Tech Support and will be reviewed as soon as possible.").then(sent => sent.delete(30000));

				staffChannel.send({embed: techReport});
			}
			else {
				msg.reply("The report could not be filed because of an incorrect type parameter. Be sure you are following the proper format:\n"+
				"``!report [type] [target] [reason]`` - use ``!info-report`` for more information.").then(sent => sent.delete(20000))
			}
		}
	}

	//Roles
	else if (command("roles", msg)) {
		msg.delete();

		msg.channel.send({embed: roles}).then(sent => sent.delete(60000));
	}

	//Rules
	else if (command("rules", msg)) {
		msg.delete();

		msg.channel.send({embed: rules}).then(sent => sent.delete(60000))
	}

	//Version
	else if (command("version", msg)) {
		msg.delete();

		msg.channel.send({embed: version}).then(sent => sent.delete(20000));
	}

	//Status
	else if (command("status", msg)) {
		msg.delete();

		msg.channel.send({embed: status}).then(sent => sent.delete(60000));
	}

	//Temporary Voice Channels
	else if (command("tempch", msg) || command("Tempch", msg)) {
		if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', "Bot") || msg.member.roles.find('name', 'Members') || msg.member.roles.find('name', 'Trusted')) {
			if (engmode == false) {
				msg.delete();

				var user = msg.member;

				var tempCmd = msg.content.split(" ").slice(1);
				var maxUsers = parseInt(tempCmd[0]) || 0;
				var tname = args[1] ? args.slice(1).join(" ") : args.join(' ');

				var tempChannelCat = '372453830161465345';
				var channelSpawner = '420512697654706196';
				var tchID;

				const userVC = user.voiceChannelID;

				console.log(maxUsers);

				if (userVC == undefined || userVC != channelSpawner) {
					msg.reply("Join the #channel-spawner channel first!").then(sent => sent.delete(15000));
				}
				else if (userVC === channelSpawner) {
					fstempchclone.clone(tname)
					.then(clone => {
					console.log("[TEMP-CHA] Channel created called: " + tname + " by: " + msg.author.tag);

					tchID = clone.id;
					tempChannels.push(tchID);

					console.log("[TEMP-CHA] Channel " + tname + " has ID: " + tchID);
					console.log("[TEMP-CHA] Temp Channels now include " + tempChannels.length + " channels of IDs: ");

					msg.reply("Channel created!").then(sent => sent.delete(15000));

					for (x = 0; x < tempChannels.length; x++) {
						console.log(tempChannels[x]);
					}

					clone.setParent(tempChannelCat);

					if (maxUsers > 1) {
						clone.setUserLimit(maxUsers).then(clone => console.log("[TEMP-CHA] Channel '" + tname + "' set max users to " + maxUsers))
						msg.reply("Setting user maximum to: " + maxUsers).then(sent => sent.delete(15000));
					}
					else if (maxUsers = null) {

					}

					msg.member.setVoiceChannel(tchID);
				
					})
					.catch(console.error);
				}
			}
			else {
				msg.reply("Engineering Mode is enabled! Turn it off before using this command!").then(sent => sent.delete(15000));

				if (msg.member.roles.find('name', 'Bot')) {
					msg.delete();
	
					msg.reply("Overriding Engineering Mode: Executing command: ``" + msg.content + "``.").then(sent => sent.delete(15000));
					console.log("[TEMP-CHA] OVERRIDE: Temporary Channel Created")
	
					var user = msg.member;
	
					var tempCmd = msg.content.split(" ");
					var maxUsersParam = tempCmd.splice(1, 1);
					var maxUsers = parseInt(maxUsersParam);
					var tname = tempCmd.splice(1).join(' ');
	
					var tempChannelCat = '372453830161465345';
					var channelSpawner = '420512697654706196';
					var tchID;
	
					const userVC = user.voiceChannelID;
	
					if (userVC == undefined || userVC != channelSpawner) {
						msg.reply("Join the #channel-spawner channel first!").then(sent => sent.delete(15000));
					}
					else if (userVC === channelSpawner) {
						fstempchclone.clone(tname)
						.then(clone => {
						console.log("[TEMP-CHA] Channel created called: " + tname + " by: " + msg.author.tag);
	
						tchID = clone.id;
						tempChannels.push(tchID);
	
						console.log("[TEMP-CHA] Channel " + tname + " has ID: " + tchID);
						console.log("[TEMP-CHA] Temp Channels now include " + tempChannels.length + " channels of IDs: ");
	
						msg.reply("Channel created!").then(sent => sent.delete(15000));
	
						for (x = 0; x < tempChannels.length; x++) {
							console.log(tempChannels[x]);
						}
	
						clone.setParent(tempChannelCat);
	
						if (maxUsers > 1) {
							clone.setUserLimit(maxUsers).then(clone => console.log("[TEMP-CHA] Channel '" + tname + "' set max users to " + maxUsers))
							msg.reply("Setting user maximum to: " + maxUsers).then(sent => sent.delete(15000));
						}
	
						msg.member.setVoiceChannel(tchID);
					
						})
						.catch(console.error);
					}
				}
			}
		}
		else {
			msg.reply("You don't have the permissions to run this command!").then(sent => sent.delete(15000));
		}
	}

	//VOUCH SYSTEM
	else if (command("vouch", msg)) {
		msg.delete();

		var vouchestot = fsvouchesdoc.vouchnumtotal++;

		var vouchRequester = msg.author.id;
		var vouchCMD = msg.content.split(" ");
		var memberFor = vouchCMD.splice(1, 1).join(' ');
		var memberForID = parseInt(memberFor);

		console.log(memberFor);
		console.log(memberForID);
		console.log(vouchestot);
		
	} else {
		msg.reply("Was that command? Perhaps try again and reference `!help` if you don't know?")
	}

	//SECRET
	if (msg.content.toLowerCase() === "fishsticks, how are you feeling?") {
		msg.reply("I'm a little rattled, feeling pretty good right now though. SkyeRanger is a pretty darn good bot doctor.");
	}

	if (msg.content.toLowerCase() == "Fishsticks, how are you?") {
		if (engmode == true) {
			msg.reply("Well, looks like engineering mode is on, so that means I'm probably being worked on. I'll be better than ever soon though. :)");
		}
		else {
			msg.reply("I'm doin' pretty good right now. That whole hijacking thing caught me off gaurd but I'm good.");
		}
	}

	if (msg.content == "good evening Fishsticks" || msg.content == "good evening fishsticks") {
		msg.reply("Good evening to you!");
	}

	if (msg.content == "ey up" || msg.content == "eyup") {
		msg.reply("Greetings! I'm right chuffed you're 'ere.");
	}

	if (msg.content == "football" || msg.content == "ffootballl") {
		msg.reply("*Erm, hrm, ~~troll~~ cough*");
	}

	if (command("feed", msg)) {
		msg.reply("Probably not a good idea. :)")
	}


}); */


//VOICE CHANNEL CONNECTION CHECK
fishsticks.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel;
	let oldUserChannel = oldMember.voiceChannel;

	if (fishsticks.tempChannels.includes(oldMember.voiceChannelID)) {
		if (oldUserChannel.members.size === 0) {
			oldUserChannel.delete()
			.then(deleted => console.log("[TEMP-CHA] Deleted channel " + oldMember.voiceChannelID + ". (Everyone Left)"));

			var vcIDIndex = fishsticks.tempChannels.indexOf(oldMember.voiceChannelID);
			if (vcIDIndex > -1) {
				fishsticks.tempChannels.splice(vcIDIndex, 1);
				console.log("[TEMP-CHA] Channel Index removed. Channels online now: " + fishsticks.tempChannels.length + " with IDs:");

				for (var t = 0; t < fishsticks.tempChannels.length; t++) {
					console.log(fishsticks.tempChannels[t]);
				}
			}
		}
	}
});



//MEMBER JOIN/LEAVE SYSTEM  ==EXPERIMENTAL==
/*fishsticks.on('guildMemberAdd', member => {
	var join = new Discord.RichEmbed();
		join.setTitle("o0o - Welcome! - o0o")
		join.setColor(fscolor)
		join.setThumbnail(member.user.avatarURL)
		join.addField("Welcome to the offical CC Discord, " + member.user.username + "! Stick around for some fish!")
		join.setDescription(member.user.username +" Joined at | " +formatDate(new Date()))
    						member.guild.channels.find("name", "fishsticks-console").send({join})

    console.log("+USER: " + member.user.username + " joined the server.");
});
*/

fishsticks.login(token);