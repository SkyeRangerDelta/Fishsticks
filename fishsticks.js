//======================================
//"FISHSTICKS" - OFFICIAL CC DISCORD BOT
//======================================

//CONSTANT DECLARATIONS
const Discord = require("discord.js");
const fs = require('fs');
const fishsticks = new Discord.Client();

const prefix = "!";
const fscolor = "#f4eb42";
const fsemercolor = "#d3150e";

const fsbuild = "1.5.9";

let engmode = false;

var fsconsoleChannel;
var announceChannel;
var fstempchclone;
var staffChannel;

var tempChannels = [];



//SESSION RECORDER
var fsvarsdoc = JSON.parse(fs.readFileSync('./fishsticks_vars.json', 'utf8'));

console.log(fsvarsdoc);

var fs_session = fsvarsdoc.sessionnum++;

console.log(fsvarsdoc);

fs.writeFileSync("./fishsticks_vars.json", JSON.stringify(fsvarsdoc));



//STARTUP PROCEDURE
fishsticks.on('ready', () => {

	//Channel Definitions
	fsconsoleChannel = fishsticks.channels.get('420001817825509377');
	announceChannel = fishsticks.channels.get('125825436650307584');
	fstempchclone = fishsticks.channels.get('420512697654706196');
	staffChannel = fishsticks.channels.get('140153900996100097');

	//Startup Message - console
	console.log(`Successfully Logged ${fishsticks.user.tag} into the server.`);
	console.log("Initialized and booted Fishsticks version " + fsbuild);
	console.log("===========================================================");
	console.log("[SESSION#] " + fs_session);
	console.log("[ENG-MODE] Currently: " + engmode)

	//Startup Message - Discord
	fishsticks.user.setActivity("!help | V" + fsbuild);

	var startupseq = new Discord.RichEmbed();
		startupseq.setTitle("o0o - FISHSTICKS STARTUP - o0o")
		startupseq.setColor(fscolor);
		startupseq.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
		startupseq.setDescription(
			"Dipping in flour...\n" +
			"Baking at 400°...\n" +
			"Fishsticks V" + fsbuild + " is ready to go!")

	fsconsoleChannel.send({embed: startupseq}).catch(console.error).then(sent => sent.delete(30000));



});

//COMMAND FUNCTION
function command(str, msg) {
	return msg.content.startsWith(prefix + str);
}

//ECHO FUNCTION
function echofunc(statement) {

	announceChannel.send(statement);
}

//TEMP CHANNEL CREATION FUNCTION
function tempVChannel() {

}



//DATE FORMATTING
function formatDate(date) {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var day = date.getDate();
	var month = date.getMonth();
	var year = date.getFullYear();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var amPM = (hour > 11) ? "PM" : "AM";

	if (hour > 12) {
		hour -= 12;
	}
	else if (hours == 0) {
		hours = "12";
	}

	if (minute < 10) {
		minute = "0" + minute;
	}

	return day + " " + months[month] + " " + year + " at " + hour + ":" + minute + ":" + amPM;
}


//----------------------------------
//FISHSTICKS COMMAND LISTING
//----------------------------------

//RICH EMBEDS
	//Channels
	var channels = new Discord.RichEmbed();
		channels.setTitle("o0o - CC DISCORD CHANNELS - o0o")
		channels.setColor(fscolor)
		channels.setDescription(
			"Wondering about all these channels off to the left? Here's a nifty list to explain it all!\n"+
			"===============================================\n"+
			"**__Server Channels__**\n"+
			"**Rules**: Lists all the rules, can also be found using ``!rules``.\n"+
			"**Annnouncements**: Read this for important news and events information!\n\n"+
			"**__CC Channels__**\n"+
			"**Hangout**: The hangout channel!\n"+
			"**Lounge**: The sub-Hangout channel!\n"+
			"**Memes**: Self-explanitory.\n"+
			"**Prayer Requests 🔒**: Post here with concerns you'd like support with.\n"+
			"**Bible Study**: Biblestudy chat should be kept here.\n"+
			"**Meeting Hall**: During CC Meetings, use this channel for meeting topics.\n"+
			"**(V) Hangout**: Vocal hangout channel!\n"+
			"**(V) The Lounge**: Vocal sub-Hangout channel!\n"+
			"**(V) Safe Haven (Not-Hangout) 🔒**: Not the hangout channel. Quiet zone, hide from trolls.\n"+
			"**(V) Bible Study**: Voice channel for Bible Study.\n"+
			"**(V) CC Book Study**: Voice channel for the book study.\n"+
			"**(V) Meeting Hall**: Voice channel for CC Meetings every other week.\n"+
			"**(V) Power Prayer Tuesdays**: PPT Voice channel.\n"+
			"**(V) Kareoke**: Like to sing? Keep it down here.\n\n"+
			"**__The Fish (Offical Games)__**\n"+
			"**Games**: General games topic channel.\n"+
			"**(V) Overwatch**: General Overwatch voice channel.\n"+
			"**(V) Rocket League**: General RL voice channel. \n"+
			"**(V) RL Team 1**: Alt RL voice channel. \n"+
			"**(V) RL Competitive**: Max 4 people, team for competitive matchmaking.\n"+
			"**(V) Ark: Survival Evolved**: General voice channel for ARK.\n"+
			"**(V) PUBG**: General PUBG voice channel.\n"+
			"**(V) PUBG Team 1**: Alt PUBG voice channel\n"+
			"**(V) PUBG Solo**: It's quiet in here, unless you find teammates!\n\n"+
			"**__Staff 🔒__**\n"+
			"*The stuff under this category is for staff!*\n\n"+
			"**__Temp Channels__**\n"+
			"*Channels created here are managed by Fishsticks or manually by staff. They are meant to be temporary and can serve any purpose*.\n\n"+
			"**__Misc__**\n"+
			"**Off Topic**: Yea, it's down here.\n"+
			"**Fishsticks Console 🔒**: Skye's Fishsticks engineering deck. It might be dangerous!\n"+
			"**AFK**: Aversion to Flying Kangaroos.\n\n"+
			"``This message will delete itself in a minute and a half.``"
		)

	//Divisions
	var divisions = new Discord.RichEmbed();
		divisions.setTitle("o0o - CC OFFICIAL DIVISIONS - o0o")
		divisions.setColor(fscolor);
		divisions.setDescription(
			"The official CC Divions are as follows:\n"+
			"---------------------------------------\n"+
			"**Rocket League**: DL: Ffootballl\n"+
			"**Ark: Survival Evolved**: DL: Grizz Galant\n"+
			"**Overwatch**: DL: Dodge\n"+
			"**PUBG**: DL: Ffootballl\n\n"+
			"``Message will delete itself in 30 seconds``"
		)

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
			"	*Valid Parameters:*\n"+
			"	``server``: (Target: ``serverIP or name``) You are reporting an issue with one of CC's Game Servers such as TF2\n"+
			"	``conduct``: (Target: ``memberID or Tag``) Reporting an issue with a certain member's conduct\n"+
			"	``tech``: (Target: ``TS`` or ``Discord``) Reporting an issue with TS or Discord\n"+
			"``!tempch [name]``: Creates a temporary channel.  You must have the CC Members, Staff, or Bot to run. Join the Channel Spawner first before running the command.\n\n"+
			"**Administrative Commands**\n" +
			"-----------------------------------------------\n" +
			"``!echo [time] [message]``: This command will take your message and broadcast it as an announcement after the specified time (in minutes) has passed.\n" +
			"``!engm``: Toggles Engineering Mode on or off depending on current state.\n\n"+
			"``This menu will delete itself in 45 seconds.``")

	//Info Report
	var infoReport = new Discord.RichEmbed();
		infoReport.setTitle("o0o - INFO CODEX - o0o")
		infoReport.setColor(fscolor)
		infoReport.setDescription(
			"``!report [type] [target] [reason]``\n"+
			"Valid Types:\n"+
			"	``server``:\n"+
			"		Used when a CC game server is having trouble. Notifies Tech Support.\n"+
			"		Valid Targets: ``server IP`` or ``name of server``\n"+
			"	``conduct``:\n"+
			"		Used to report troublesome members (trolls). Notifies Staff members.\n"+
			"		Valid Targets: ``member ID (Tag)``\n"+
			"	``tech``:\n" +
			"		Used to report TS/Discord program problems such as permissions issues. Notifies Tech Support\n"+
			"		Valid Targets: ``TS`` or ``Discord``\n\n"+
			"Valid Reasons: Use your best judgement to describe the problem and any insight you may have. Keep it quick and to the point.\n\n"+
			"``This message will delete itself in 30 seconds.``"
		)

	//IPS
	var ips = new Discord.RichEmbed();
		ips.setTitle("o0o - CC 'THE FISH' SERVERS - o0o")
		ips.setColor(fscolor)
		ips.setDescription(
			"**__Ark: Survival Evolved__**\n"+
			"Ark Ragnarok: ``172.86.182.219``\n"+
			"Ark PVP: ``172.86.182.220``\n"+
			"Ark PVE: ``172.86.182.221``\n\n"+
			"**__TF2__**\n"+
			"TF2 'The Fish' Stock: ``172.86.182.214:27015``\n"+
			"TF2 Event Map: ``172.86.182.215``\n\n"+
			"**__CSGO__**\n"+
			"CSGO Casual: ``172.86.182.217``\n\n"+
			"``This message will delete itself in 45 seconds.``"
		);

	//Links
		var links = new Discord.RichEmbed();
			links.setTitle("o0o - CC GAMING LINKS - o0o")
			links.setColor(fscolor)
			links.setDescription(
				"[CC Gaming Website](https://www.ccgaming.com)\n" +
				"[CC Forums](https://forums.ccgaming.com)\n\n" +
				"``This message will delete itself in 30 seconds.``")

	//Roles
		var roles = new Discord.RichEmbed();
			roles.setTitle("o0o - CC DISCORD ROLES - o0o")
			roles.setColor(fscolor);
			roles.setDescription(
				"Roles are the 'groups' that you as a user can be assigned to. They control the permissions that you have the power to work with. Here's a nifty list to describe them.\n" +
				"**Everyone**: No color assignment, default white. You can talk in the voice channels and read text history.\n"+
				"**Logger**: The logger bot's role.\n" +
				"**Trusted**: Everyone role plus text chat functions. Can change nickname.\n" +
				"**Applicant**: Trusted, but cannot attach files.\n" +
				"**Members**: Trusted but can also move users.\n" +
				"**ACC Member**: Identifier for ACC - no perms, works in tangent with Members role.\n" +
				"**CC Members**: Identifier for CC - no permissions, works in tangent with Members role.\n" +
				"**Timeout**: No permissions except for reading text channels.\n" +
				"**Admin**: There's a lot of permissions in there. Cannot create invites or manage emojis.\n"+
				"**Bot**: Default bot role (plus SkyeRanger). Can ban you.\n" +
				"**Staff**: All perms except server management.\n" +
				"**Event Coordinator**: Identifier for ECs. Used in tangent with another permissions role such as Staff.\n" +
				"**Division Leader**: Identifier for DLs. Used in tangent with another permissions role.\n" +
				"**Tech Support**: Administrator level permissions. Add-on permissions used in tangent with another role.\n" +
				"**Council Advisor**: Server administration permissions. Add-on permissions used in tangent with another role.\n" +
				"**Council Member**: Administrator level permissions. Add-on permissions used in tangent with another role.\n\n" +
				"``This message will delete itself in 1 minute.``"
			)

	//Rules
		var rules = new Discord.RichEmbed();
			rules.setTitle("o0o - CC DISCORD RULES - o0o")
			rules.setColor(fsemercolor)
			rules.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
			rules.setDescription(
				"1.  Do not move anyone without that person’s permission.\n " +
				"2.  Do not kick or ban anyone to be funny or without reason. Do not kick yourself either.\n" +
				"3.  Do not abuse your Registered User or Trusted powers. They can be taken away!\n" +
				"4.  Do not swear or be disrespectful to ANYONE!\n" +
				"5.  Do not make noises that are annoying people.\n" +
				"6.  Do not act obnoxious.\n" +
				"7.  Do not play music or sing without permission from all people in the channel.\n" +
				"8.  Do not join a channel and speak right away; wait until the conversation stops.\n" +
				"9.  Use the proper channels as they are labeled. Don’t annoy people by talking in a channel such as Big Fish when someone is trying to play.\n" +
				"10. Do not ask to be kicked or banned. Your wish may be granted.\n" +
				"11. No “Your Mom” jokes in TeamSpeak, Discord, Forums, or Servers.\n" +
				"12. Do not discuss or link stolen/pirated software, music, movies, or private MMO servers.\n" +
				"13. Use your normal in-game or forums username.\n" +
				"14. Multiple connections or sessions, (including ‘bots’) will be considered hacking and will NOT be tolerated.\n" +
				"15. Please respect the private channels. Do not join without permission.\n" +
				"16. Please add the name or abbreviation of the game you are playing to your temporary channel name so we know what game you are playing.\n" +
				"17. Users may not have any inappropriate names and may not introduce any inappropriate or profane chat, links, or content. \n" +
				"18. Swearing is not permitted.\n" +
				"19. Users may not use The Christian Crew servers for advertisement.\n" +
				"20. Disputes or complaints regarding Members or an Admin must be handled in private. Do not post or voice complaints publicly. You may ask a admin to create a private channel to discuss issues with a member if you need. \n" +
				"21. No emojis in nicknames.\n\n" +
				"``This message will delete itself in 1 minute.``")

	//Version
		var version = new Discord.RichEmbed();
			version.setTitle("o0o - FISHSTICKS VERSION REPORT - o0o")
			version.setColor(fscolor)
			version.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
			version.setDescription(
				"Fishsticks is currently running version " + fsbuild + ".\n\n" +
				"For build information and or changelogs, check with @SkyeRangerDelta#0458 .\n\n"+
				"``This message will delete itself in 20 seconds.``")

	//Status
		var status = new Discord.RichEmbed();
			status.setTitle("o0o - FISHSTICKS STATUS REPORT - o0o");
			status.setColor(fscolor);
			status.setDescription(
				"Current variables listing in this Fishsticks session.\n"+
				"-----------------------------------------------\n"+
				"File Read Syst: ``Online``" + "\n"+
				"Session Number: ``" + fs_session + "``\n"+
				"Version Number: ``" + fsbuild + "``\n" +
				"Engineering Mode: ``" + engmode + "``\n"+
				"Bot Identifier: ``8663``\n\n"+
				"``This message will delete itself in 1 minute.``"
			);

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

//COMMAND EXECUTION

fishsticks.on('message', async msg => {
	const args = msg.content.split(" ").slice(1);

	//Role Definitions
	var staffRole = msg.guild.roles.find('name', 'Staff');
	var techRole = msg.guild.roles.find('name', 'Tech Support');

	//Commands sorted alphabetically
	//Channels
	if (command("channels", msg)) {
		msg.delete();

		msg.channel.send({embed: channels}).then(sent => sent.delete(90000));
	}

	//Divisions
	if (command("divisions", msg)) {
		msg.delete();

		msg.channel.send({embed: divisions}).then(sent => sent.delete(30000));
	}

	//Echo(S)
	if (command("echo", msg)) {

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
				msg.reply("Engineering Mode is enabled. Turn it off before using this command!");
			}
		}
		else {
			msg.reply("You don't have the correct permissions!");
		}
	}

	//Engineering Mode(S)
	if (command("engm", msg)) {

		msg.delete();

		if (msg.member.roles.find("name", "Staff") || msg.member.roles.find("name", "Bot")) {

			engmode = !engmode;

			console.log("[ENG-MODE] Toggled to " + engmode + " by: " + msg.author.tag);

			msg.reply("Engineering Mode is now: " + engmode + ".").then(sent => sent.delete(15000));

			fsconsoleChannel.send("Fishsticks Engineering Mode has been toggled to " + engmode + " by: " + msg.author);

			if (engmode == true) {
				fishsticks.user.setActivity("ENGM Enabled | !help");
			}
			else {
				fishsticks.user.setActivity("!help | V" + fsbuild);
			}
		}
		else {
			msg.reply("You don't have the proper permissions to toggle Engineering Mode!");
		}
	}

	//Hello
	if (command("hello", msg)) {
		msg.reply("Hello to you too!");
	}

	//Help
	if (command("help", msg)) {
		msg.delete();

		msg.channel.send({embed: help}).then(sent => sent.delete(45000));
	}

	//Hi
	if (command("hi", msg)) {
		msg.reply("Hey yourself! :P");
	}

	//Info - Report
	if (command("info-report", msg)) {
		msg.delete();

		msg.channel.send({embed: infoReport}).then(sent => sent.delete(30000));
	}

	//Ips
	if (command("ips", msg)) {
		msg.delete();

		msg.channel.send({embed: ips}).then(sent => sent.delete(45000));
	}

	//Links
	if (command("links", msg)) {
		msg.delete();

		msg.channel.send({embed: links}).then(sent => sent.delete(30000));
	}

	//Report
	if (command("report", msg)) {
		msg.delete();

		if (msg.member.roles.find("name", "Staff") || msg.member.roles.find("name", "CC Member") || msg.member.roles.find("name", "Trusted")) {

			var reportCmdSplit = msg.content.split(" ");
			var type = reportCmdSplit.splice(1, 1);
			var target = reportCmdSplit.splice(1, 1);
			var reason = reportCmdSplit.splice(1).join(' ');

			//[ENG-MODE]

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
				msg.reply("The " + type + " report has been shunted to the Tech Support team and they will review the case as soon as possible. Thanks!");

				staffChannel.send({embed: serverReport});
			}
			else if (type == "conduct") {
				msg.reply("The " + type + " report has been shunted to Staff and will be reviewed.");

				staffChannel.send({embed: conductReport});
			}
			else if (type == "tech") {
				msg.reply("The " + type + " report has been shunted to Tech Support and will be reviewed as soon as possible.");

				staffChannel.send({embed: techReport});
			}
			else {
				msg.reply("The report could not be filed because of an incorrect type parameter. Be sure you are following the proper format:\n"+
				"``!report [type] [target] [reason]`` - use ``!info-report`` for more information.")
			}
		}
	}

	//Roles
	if (command("roles", msg)) {
		msg.delete();

		msg.channel.send({embed: roles}).then(sent => sent.delete(60000));
	}

	//Rules
	if (command("rules", msg)) {
		msg.delete();

		msg.channel.send({embed: rules}).then(sent => sent.delete(60000))
	}

	//Version
	if (command("version", msg)) {
		msg.delete();

		msg.channel.send({embed: version}).then(sent => sent.delete(20000));
	}

	//Status
	if (command("status", msg)) {
		msg.delete();

		msg.channel.send({embed: status}).then(sent => sent.delete(60000));
	}

	//Temporary Voice Channels
	if (command("tempch", msg)) {
		if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', "Bot") || msg.member.roles.find('name', 'CC Member') || msg.member.roles.find('name', 'Trusted')) {
			if (engmode == false) {
				msg.delete();

				var user = msg.member;

				var tempCmd = msg.content.split(" ");
				var maxUsersParam = tempCmd.splice(1, 1);
				var maxUsers = parseInt(maxUsersParam);
				var tname = tempCmd.splice(1).join(' ');

				var tempChannelCat = '372453830161465345';
				var channelSpawner = '420512697654706196';
				var tchID;

				const userVC = user.voiceChannelID;

				console.log(maxUsers);

				if (userVC == undefined || userVC != channelSpawner) {
					msg.reply("Join the #channel-spawner channel first!");
				}
				else if (userVC === channelSpawner) {
					fstempchclone.clone(tname)
					.then(clone => {
					console.log("[TEMP-CHA] Channel created called: " + tname + " by: " + msg.author.tag);

					tchID = clone.id;
					tempChannels.push(tchID);

					console.log("[TEMP-CHA] Channel " + tname + " has ID: " + tchID);
					console.log("[TEMP-CHA] Temp Channels now include " + tempChannels.length + " channels of IDs: ");

					msg.reply("Channel created!")

					for (x = 0; x < tempChannels.length; x++) {
						console.log(tempChannels[x]);
					}

					clone.setParent(tempChannelCat);

					if (maxUsers > 1) {
						clone.setUserLimit(maxUsers).then(clone => console.log("[TEMP-CHA] Channel '" + tname + "' set max users to " + maxUsers))
						msg.reply("Setting user maximum to: " + maxUsers);
					}

					msg.member.setVoiceChannel(tchID);
				
					})
					.catch(console.error);
				}
			}
			/*else if (msg.author.roles.find('name', 'Bot')) {
				msg.reply("Overriding Engineering Mode: Executing command: ``" + msg.content + "``.");

				msg.delete();

				var user = msg.member;

				var tempCmd = msg.content.split(" ");
				var maxUsers = tempCmd.splice(1, 1);
				var tname = tempCmd.splice(1).join(' ');

				var tempChannelCat = '372453830161465345';
				var channelSpawner = '420512697654706196';
				var tchID;

				const userVC = user.voiceChannelID;

				if (userVC == undefined || userVC != channelSpawner) {
					msg.reply("Join the #channel-spawner channel first!");
				}
				else if (userVC === channelSpawner) {
					fstempchclone.clone(tname)
					.then(clone => {
					console.log("[TEMP-CHA] Channel created called: " + tname + " by: " + msg.author.tag);

					tchID = clone.id;
					tempChannels.push(tchID);

					console.log("[TEMP-CHA] Channel " + tname + " has ID: " + tchID);
					console.log("[TEMP-CHA] Temp Channels now include " + tempChannels.length + " channels of IDs: ");

					for (x = 0; x < tempChannels.length; x++) {
						console.log(tempChannels[x]);
					}

					clone.setParent(tempChannelCat);

					if (maxUsers > 1) {
						clone.setUserLimit(maxUsers).then(clone => console.log("[TEMP-CHA] Channel '" + tname + "' set max users to " + maxUsers))
					}

					msg.member.setVoiceChannel(tchID);
				
					})
					.catch(console.error);
				}
			}*/
			else {
				msg.reply("Engineering Mode is enabled! Turn it off before using this command!");
			}
		}
		else {
			msg.reply("You don't have the permissions to run this command!");
		}
	}


});


//VOICE CHANNEL CONNECTION CHECK
fishsticks.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel;
	let oldUserChannel = oldMember.voiceChannel;

	if (tempChannels.includes(oldMember.voiceChannelID)) {
		if (oldUserChannel.members.size === 0) {
			oldUserChannel.delete()
			.then(deleted => console.log("[TEMP-CHA] Deleted channel " + oldMember.voiceChannelID + ". (Everyone Left)"));
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

fishsticks.login('NDE5OTk2NzY5OTc2MzIwMDIw.DX4QCg.sYlpgJRC_FawiYtBXnAYYodlxAw')