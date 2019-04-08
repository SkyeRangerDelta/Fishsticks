//======================================
//"FISHSTICKS" - OFFICIAL CC DISCORD BOT
//======================================
//...........Maintained By..............
//..........SkyeRangerDelta.............

//--------------------------------------
//..........SYSTEM VARIABLES............
//--------------------------------------
//CONSTANT DECLARATIONS
const Discord = require("discord.js");
const fs = require('fs');
const colors = require('colors');
const fishsticks = new Discord.Client();

const systems = require('./Modules/fs_systems.json');
const sys = require('./Modules/Core/coresys.json');
const chs = require('./Modules/fs_ids.json');
const config = require('./Modules/Core/corecfg.json');
const subrouts = require('./Modules/Functions/subRoutines.js');
const log = require('./Modules/Functions/log.js');
const syslogcore = require('./Modules/Functions/syslog.js');
const pollInit = require('./Modules/PollingSystem/initPolls.js');
const currDateTime = require('./Modules/Functions/currentDateTime.js');

const token = systems.token;
const fscolor = config.fscolor;
const fsemercolor = config.fsemercolor;
const prefix = config.prefix;

//BOT GLOBAL VARIABLES
fishsticks.tempChannels = [];
fishsticks.version = sys.fsversion;
fishsticks.queue = new Map();
fishsticks.servStatus;
fishsticks.mattybmode = true;
fishsticks.playrejects = 0;
fishsticks.commandAttempts = 0;
fishsticks.commandSuccess = 0;
fishsticks.guildID = chs.guildid;
fishsticks.musicPlaying = false;
fishsticks.vc;
fishsticks.eff;
fishsticks.ranger;
fishsticks.currentPolls = [];

//SESSION/ENGM MANAGER
var fsvarsdoc = JSON.parse(fs.readFileSync('./fishsticks_vars.json', 'utf8'));
var fs_session = fsvarsdoc.sessionnum++;
fishsticks.syssession = fs_session;

fs.writeFileSync("./fishsticks_vars.json", JSON.stringify(fsvarsdoc));

let engDoc = JSON.parse(fs.readFileSync('./Modules/fishsticks_engm.json', 'utf8'));
let engmode = engDoc.engmode;

//SUBROUTINES
fishsticks.subroutines = new Map([
	["online", true],
	["tempch", true],
	["twitch", true],
	["musi", true],
	["echo", true],
	["matb", false],
	["engm", false],
	["passive", true],
	["active", true],
	["nlinkscn", true],
	["vouch", true],
	["poll", true],
	["gamerole", true]
]);

fishsticks.engmode = engmode;
fishsticks.subroutines.set("engm", engmode);

//SUBROUTINES CHECK
subrouts.run(fishsticks);

//INITIALIZE POLLS
pollInit.run(fishsticks, "init");

//CHANNEL INITIALIZATIONS
var fsconsoleChannel;
var crashpad;

fishsticks.systemLog;

//ROLE INITIALIZATIONS

//USER INITIALIZATIONS
var ranger;

//--------------------------------------
//............MAIN SCRIPT...............
//--------------------------------------

//STARTUP PROCEDURE
fishsticks.on('ready', () => {

	//CHANNEL DEFINITIONS
	fsconsoleChannel = fishsticks.channels.get(chs.fsconsole);
	announceChannel = fishsticks.channels.get(chs.announcements);
	staffChannel = fishsticks.channels.get(chs.staffChannel);
	hangoutch = fishsticks.channels.get(chs.hangout);
	crashpad = fishsticks.channels.get(chs.crashpad);
	moderator = fishsticks.channels.get(chs.moderator);

	fishsticks.consoleChannel = fsconsoleChannel;
	fishsticks.systemLog = fishsticks.channels.get(chs.systemLog);
	let systemLog = fishsticks.systemLog;

	//GUILD DEFINITIONS
	fishsticks.CCGuild = fishsticks.guilds.get(fishsticks.guildID);

	//USER DEFINITIONS
	ranger = fishsticks.users.get(chs.ranger);
	fishsticks.ranger = ranger;

	//SERVER STATUS
	if (fishsticks.CCGuild.available) {
		fishsticks.servStatus = "`Online`";
	}
	else {
		fishsticks.servStatus = "`Potential Outage`";
	}
	//LOGGER INITIALZE
	function syslog(message, level) {
		syslogcore.run(fishsticks, message, level);
	}

	//Startup Message - console
	console.log(colors.green(`Successfully Logged ${fishsticks.user.tag} into the server.`));
	console.log(colors.green("Initialized and booted Fishsticks version " + fishsticks.version));
	console.log(colors.green("==========================================================="));
	syslog(`Successfully Logged ${fishsticks.user.tag} into the server\nInitialized and booted Fishsticks version ` + 
		fishsticks.version + `\n===========================================================`, 0);
	console.log(colors.green("[SESSION#] " + fishsticks.syssession));
	syslog(`[SESSION#] ` + fishsticks.syssession, 0);
	console.log(colors.green("[ENG-MODE] Currently: " + engmode));
	syslog(`[ENG-MODE] Currently: ` + engmode, 0);
	console.log(colors.gray("[*SUBR-CON*] Subroutines initialized and configured."));
	syslog(`[*SUBR-CON*] Subroutines initialized and configured`, 1);

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

//LOGGER CONTROLLER (Log levels 0-4)
function syslog(message, level) {
	try {
		log.run(fishsticks, message, level);
	}
	catch (err) {
		systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
	}
}

//----------------------------------
//FISHSTICKS COMMAND SYSTEMS
//----------------------------------

var svuArr = ["fishsticks is bad", "fishsticks are bad", "fishsticks are gross", "fishsticks eww", "hate fishsticks", "fishsticks is nasty", "fishsticks are nasty", "fishsticks shush up", "shut up fishsticks", "fishticks shut up", "fishsticks, shut up", "caught fishsticks", "fishsticks is a girl", "fishsticks a girl"];

//MESSAGE AND EVENT SYSTEMS
fishsticks.on('message', async msg => {

	if (msg.channel instanceof Discord.DMChannel) { //ALPHA LEVEL COMMANDS
		if (msg.author.id == chs.ranger) {
			console.log(colors.red("[ALPHA LEVEL] Incoming Command: " + msg))
			syslog("[ALPHA LEVEL] Incoming Command " + msg, 4);
			msg.channel.send("Greetings. Attempting to process command...");

			/*
			const cmd = msg.content.trim().split(/ +/g);
			const cmdID = cmd[0].toLowerCase();

			if (cmdID == "subroutine") {
				let cmdFile = require(`./Commands/Active/${cmdID}.js`);
				cmdFile.run(fishsticks, msg, cmd);
			}
			else {
				msg.channel.send("I'm sorry Dave, I can't do that.");
			}
			*/
		}
	}
	else { //NON-ALPHA LEVEL COMMANDS

		
		//NEWCOMER LINK SCREEN
		try {
			if (fishsticks.subroutines.get("nlinkscn")) {
				if (msg.member.roles.size === 1) {
					if (msg.content.includes(".com") || msg.content.includes(".net") || msg.content.includes(".org")) {
						console.log("[N. LINK SCREEN] Newcomer Link Intercepted.");
						syslog("[N. LINK SCREEN] Newcomer Link Intercepted." + msg, 2);
						msg.delete();
						msg.reply("As a newcomer to this server, your permissions to post links are revoked. You may post links once you are granted the Recognized role.").then(sent => sent.delete(20000));
					}
				}
			}
		} catch (newcomerLinkErr) {
			console.log("[N. LINK SCREEN] [ERROR] Something went wrong.\n\n" + newcomerLinkErr);
			syslog("[N. LINK SCREEN] [ERROR] Something went wrong.\n\n" + newcomerLinkErr, 3);
		}

		//TWITCH DOMAIN SCREEN
		try {
			if (fishsticks.subroutines.get("twitch")) {
				if (((msg.content.includes("streaming now")) || ((msg.content.includes("twitch")) && (msg.content.includes(".tv"))))) {
					if (msg.member.roles.find("name", "The Nod")) {
						console.log("[TWITCH-SCREEN] Link granted from user " + msg.author.username);
						syslog("[TWITCH-SCREEN] Link granted from user " + msg.author.username, 3);
						msg.reply("Post clearance granted, you have *The Nod*.").then(sent => sent.delete(10000));
					}
					else if (msg.member.roles.find("name", "Staff")) {
						console.log("[TWITCH-SCREEN] Link granted from staff user " + msg.author.username);
						syslog("[TWITCH-SCREEN] Link granted from staff user " + msg.author.username, 3);
						msg.reply("Post clearance overridden by Staff. I'd look into getting *The Nod*.").then(sent => sent.delete(10000));
					}
					else {
						msg.delete();
						console.log("[TWITCH-SCREEN] Link busted from user " + msg.author.username);
						syslog("[TWITCH-SCREEN] Link busted from user " + msg.author.username, 3);
			
						msg.reply("Post unauthorized and cleared. You need *The Nod* before posting Twitch links! See `!rules`.").then(sent => sent.delete(20000));
					}
				}
			}
		} catch (twitchScreenErr) {
			console.log("[TWITCH-SCREEN] [ERROR] Something has gone wrong.\n\n" + twitchScreenErr);
			syslog("[TWITCH-SCREEN] [ERROR] Something has gone wrong.\n\n" + twitchScreenErr, 3);
		}

		//GAME ROLE CHECK
		/*
		if (msg.content.includes('@')) {
			console.log("[GAME-ROLE] Ping detected, checking for role...");
			let ping = msg.mentions.roles.first();

			console.log("[GAME-ROLE] Ping: " + ping);
			console.log("[GAME-ROLE] Ping Name: " + ping.name);

			let rolesJSON = JSON.parse(fs.readFileSync('./Modules/GameRoles/gameRoles.json'));
			for (roleItem in rolesJSON.roles) {
				if (rolesJSON.roles[roleItem].game == ping.name) {
					console.log("[GAME-ROLE] Game role ping detected for " + ping.name + "\nSetting new last ping to: " + currDateTime());
					rolesJSON.roles[roleItem].lastPing = currDateTime();
				}
			}

			fs.writeFileSync('./Modules/GameRoles/gameRoles.json', JSON.stringify(rolesJSON));
		}
		*/

		//PASSIVE COMMANDS
		//--> Administrative achrules: Shows rules in the #rules channel
		try {
			if ((msg.content == "achrules") && (msg.member.roles.find("name", "Staff"))) {
				msg.delete();
	
				var achrules = new Discord.RichEmbed();
					achrules.setTitle("o0o - CCG Discord Rules - o0o");
					achrules.setColor(config.fsemercolor);
					achrules.setThumbnail("https://cdn.discordapp.com/attachments/420001817825509377/477289259158601729/CCG_Logo.png");
					achrules.setDescription(
						"We, the members of “The Christian Crew”, stand united in our effort to provide the online gaming community with a clean environment, of fellowship and exciting"+
						" game play. Our members will conduct themselves with integrity and decency, reflecting true Christian Character, in order that our Lord and Savior, Jesus Christ,"+
						" might be honored and glorified. We are committed to the ministry and growth of our community for the Kingdom of God, presenting the Gospel of Jesus Christ as"+
						" the fundamental truth of God. Finally, we pledge to never forget that we are Christians first, and fellow gamers second.\n"
					);
					achrules.addField("Rules:",
						"1. Follow All General Conduct Rules\n"+
						"2. Be respectful of others. If someone does not like your behavior, stop or go to a new channel.\n"+
						"3. Please only stream or record in a channel after obtaining permission from others in the channel to do so.\n"
					);
					achrules.addField("General Conduct Rules:",
						"A. Be respectful to others, their personhood, beliefs, gender, race, nationality, disability, or any other way they may differ from you. (Matthews 7:12)\n"+
						"B. Obey all laws and end user agreements. (No sharing or talking about pirated software whatsoever. Fishsticks will have your head.) Romans 13:8\n"+
						"C. If you feel someone to be guilty of any wrong doing, please talk to them privately or not at all (!report is a thing too.) Matthew 18:15\n"+
						"D. Please refrain from advertising or recruiting for anything without prior approval.\n"
					);
					achrules.addField("Websites:",
						"[Christian Crew Gaming Website](https://www.ccgaming.com/)\n"+
						"[Apply for Membership](https://www.ccgaming.com/join/)\n"+
						"[CCG Forums](https://forums.ccgaming.com/)\n"+
						"[Discord Server Invite Link](https://discord.ccgaming.com/)\n"
					);
					achrules.addField("Fishsticks & Discord Help:",
						"[Complete Discord Guide (Forum Post)](https://forums.ccgaming.com/viewtopic.php?f=2&t=24357)\n"+
						"[Complete Discord Reference (KBase Article)](https://forums.ccgaming.com/kb/viewarticle?a=2)\n"+
						"[Fishsticks Official Wiki Page](https://wiki.pldyn.net/index.php/Fishsticks)\n"+
						"[KBase Article](https://forums.ccgaming.com/kb/viewarticle?a=3)\n"
					);
	
				msg.channel.send({embed: achrules});
			}
		} catch (achErr) {
			console.log("[ERROR] Something has gone wrong posting the rules to the rules channel.")
		}

		//Passive try/catch
		try {

			if (fishsticks.subroutines.get("passive")) {
				let line = msg.content.toLowerCase();

				if (line == "ni hao" || line == "ni hao ma") {
					msg.reply("Hao!");
					fishsticks.commandSuccess++;
				}

				if (line == "i have the high ground") {
					msg.delete();
					msg.channel.send({files: ["./images/highGround.gif"]});
				}

				if (line == "fly you fools") {
					msg.delete();
					msg.channel.send("GANDALF!", {files: ["./images/flyFools.gif"]});
				}

				if (line == "the meaning of life" || line == "the meaning of the universe" || line == "the meaning of life, the universe, and everything" || line == "the meaning of everything") {
					msg.delete();
					msg.channel.send("Yes, yes, it's quite simple really...", {files: ["./images/42.gif"]});
				}

				if (line == "holy hand grenade" || line == "hand grenade") {
					msg.delete();
					msg.channel.send("**A reading from the Book of Armaments, Chapter 4, Verses 16 through 20:**\n\n" +
					"Then did he raise on high the Holy Hand Grenade of Antioch, saying, 'Bless this, O Lord, that with it thou mayst blow thine enemies to tiny bits, in thy mercy.' And the people did rejoice and did feast upon the lambs and toads and tree-sloths and fruit-bats and orangutans and breakfast cereals ... Now did the Lord say, 'First thou pullest the Holy Pin. Then thou must count to three. Three shall be the number of the counting and the number of the counting shall be three. Four shalt thou not count, neither shalt thou count two, excepting that thou then proceedeth to three. Five is right out. Once the number three, being the number of the counting, be reached, then lobbest thou the Holy Hand Grenade in the direction of thine foe, who, being naughty in my sight, shall snuff it'\nhttps://media.giphy.com/media/ffyetb56Iux2M/giphy.gif");
				}

				if (line == "flesh wound" || line == "just a flesh wound") {
					msg.delete();
					msg.channel.send("Nah it's not, your arms off!", {files: ["./images/fleshWound.gif"]});
				}

				if (line == "dark helmet") {
					msg.delete();
					msg.channel.send("Hehe.", {files: ["./images/helmet.gif"]});
				}

				if (line == "ludicrous speed") {
					msg.delete();
					msg.channel.send("Ludicrous Speed, GO!", {files: ["./images/ludicrous.gif"]});
				}

				if (line == "you're the worst") {
					msg.channel.send({files: ["./images/dipper.gif"]});
				}

				if (line == "the duchess approves") {
					msg.channel.send({files: ["./images/duchess.gif"]});
				}

				if (line == "plaid") {
					msg.delete();
					msg.channel.send({files: ["./images/plaid.gif"]});
				}
		
				if (line == "hello there") {
		
					if (msg.author == ranger) {
						msg.channel.send("Admiral Delta!", {files: ["./images/grievous2.gif"]});
					}
					else {
						msg.channel.send("General " + msg.author.username + "!", {files: ["./images/grievous.gif"]});
					}
					fishsticks.commandSuccess++;
					return;
				}
		
				if (line == "order 66") {
					msg.channel.send("**Execute all the Jedis**", {files: ["./images/dewit.gif"]});
					fishsticks.commandSuccess++;
				}
		
				if (msg.content.includes("good music") || msg.content.includes("great music")) {
					msg.channel.send("*Did someone say, `music`?*", {files: ["./sounds/Journey - Separate Ways.mp3"]});
					fishsticks.commandSuccess++;
				}
			}
	
			for (var i = 0; i < svuArr.length; i++) {
				if (msg.content.toLowerCase().includes(svuArr[i])) {
					msg.reply("Excuse me!? We are going to have to have a talk about where your standards lie and where they should be. Keep that attitude up and I'll have to take extra measures... (automatic 15 respect point loss).\n\n *Very idea...\nHating fishsticks...*")
				}
			}
		} catch (passiveCatchErr) {
			console.log("[ERROR] Something has gone askew in the processing of a passive command.\n\n" + passiveCatchErr);
			syslog("[ERROR] Something has gone askew in the processing of a passive command.\n\n" + passiveCatchErr, 3);
		}

		if (msg.content.includes("thonk")) {

			if (msg.author.id == fishsticks.user.id) return
			msg.react(fishsticks.emojis.find("name", "thonk"));

			msg.channel.send("Hehe. *Thonk*", {files: ["./images/thonk.png"]});
			fishsticks.commandSuccess++;
		}
		else { //MESSAGE COMMAND HANDLER
			//Error handling
			try {
				if (msg.author.fishsticks) return
				if (msg.author.id == fishsticks.user.id) return

				if (msg.channel == fishsticks.systemLog) {
					console.log(`A message from ${msg.author.username} was deleted in the system log.`)
					msg.delete();
					return syslog(`A message from ${msg.author.username} was deleted in the system log.`, 0);
				}

				const statement = msg.content.toLowerCase();
				const pcmd = statement.split(" ");
				const cmd = msg.content.slice(prefix.length).trim().split(/ +/g);
				const cmdID = cmd.shift();
			
				//ACTIVE COMMANDS
				if (msg.content.charAt(0) == prefix) {
					if (fishsticks.subroutines.get("active")) {
						console.log(colors.green("[ACT-COMM] Attempting Resolution for command: " + cmdID));
						syslog("[ACT-COMM] Attempting Resolution for command: " + cmdID, 0);
						fishsticks.commandAttempts++;
						try {
							let cmdFile = require(`./Commands/Active/${cmdID}.js`);
							cmdFile.run(fishsticks, msg, cmd);
							console.log(colors.green("[ACT-COMM] Success"));
							syslog("[ACT-COMM] Success", 0);
							fishsticks.commandSuccess++;
						}
						catch (err) {
							console.log(colors.yellow("[ACT-COMM] Failed:\n" + err));
							syslog("[ACT-COMM] Failed:\n" + err, 3);
							msg.reply("You trying to thonk me? That's not a command! Use `!help` to get a reference.").then(sent => sent.delete(20000));
						}
					}
					else {
						msg.reply("The `[ACT-COMM]` subroutine has been disabled. This is probably for a very good reason. " + ranger);

						//SUBROUTINE ALPHA LEVEL ACCESS
						if (msg.author.id == "107203929447616512") {

							const cmd = msg.content.slice(prefix.length).trim().split(/ +/g);
							const cmdID = cmd.shift().toLowerCase();
				
							if (cmdID == "subroutine") {
								let alphaCmdF = require(`./Commands/Active/${cmdID}.js`);
								alphaCmdF.run(fishsticks, msg, cmd);

								msg.channel.send("ALPHA LEVEL COMMAND (" + ranger + "): [*SUBR-CON*] Access");
							}
						}
					}
				}
				else {//PASSIVE COMMANDS
					if (fishsticks.subroutines.get("passive")) {
						console.log(colors.blue("[PAS-COMM] Attempting Resolution for command: " + pcmd[0]));
						syslog("[PAS-COMM] Attempting Resolution for command: " + pcmd[0], 0);
						fishsticks.commandAttempts++;
						try {
							let pCmdFile = require(`./Commands/Passive/${pcmd[0]}.js`);
							pCmdFile.run(fishsticks, msg, cmd);
							console.log(colors.blue("[PAS-COMM] Success"));
							syslog("[PAS-COMM] Success", 0);
							fishsticks.commandSuccess++;
						} catch (err) {
							console.log(colors.gray("[PAS-COMM] Failed: " + err));
							syslog("[PAS-COMM] Failed:\n" + err, 3);
						}
					}
				}
			} catch (commandHandlerErr) {
				console.log(colors.red("[COMMAND HANDLER] [HIGH LEVEL] [ERROR] SOMETHING IS WRONG WITH THE HANDLER.\n\n" + commandHandlerErr));
				syslog("[COMMAND HANDLER] [HIGH LEVEL] [ERROR] SOMETHING IS WRONG WITH THE HANDLER.\n\n" + commandHandlerErr, 4);
			}
		}
	}
});

	

//VOICE CHANNEL CONNECTION CHECK
fishsticks.on('voiceStateUpdate', (oldMember, newMember) => {

	let newUserChannel = newMember.voiceChannel;
	let oldUserChannel = oldMember.voiceChannel;

	try {
		if (fishsticks.tempChannels.includes(oldMember.voiceChannelID)) {
			if (oldUserChannel.members.size === 0) {
				oldUserChannel.delete()
				.then(deleted => console.log("[TEMP-CHA] Deleted channel " + oldMember.voiceChannelID + ". (Everyone Left)"));
				syslog("[TEMP-CHA] Deleted channel " + oldMember.voiceChannelID + ". (Everyone Left)", 1);
	
				var vcIDIndex = fishsticks.tempChannels.indexOf(oldMember.voiceChannelID);
				if (vcIDIndex > -1) {
					fishsticks.tempChannels.splice(vcIDIndex, 1);
					console.log("[TEMP-CHA] Channel Index removed. Channels online now: " + fishsticks.tempChannels.length + " with IDs:\n");
					syslog("[TEMP-CHA] Channel Index removed. Channels online now: " + fishsticks.tempChannels.length + " with IDs:\n", 0);
	
					for (var t = 0; t < fishsticks.tempChannels.length; t++) {
						console.log(fishsticks.tempChannels[t]);
						syslog(fishsticks.tempChannels[t], 1);
					}
				}
			}
		}
	}
	catch (channelErr) {
		console.log(colors.red("[CHANNEL EVENT] A channel event couldn't be handled!"));
		syslog("[CHANNEL EVENT] A channel event couldn't be handled!", 3);
	}
});

//MEMBER JOIN/LEAVE SYSTEM
fishsticks.on('guildMemberAdd', member => {

	//DEFINE GUILD
	server = member.guild;

	//DEFINE NEWCOMER MESSAGE
	var join = new Discord.RichEmbed();
		join.setTitle("o0o - Welcome! - o0o")
		join.setColor(fscolor)
		join.setThumbnail(member.user.avatarURL)
		join.addField("Welcome to the offical CC Discord, " + member.user.username + "! Stick around for some fish!", member.user.username + " joined us!")
		join.setDescription(
			"Salutations be unto you. This is the official CCG Discord server. The community is open to any questions that you may have and should you need to consult any of the staff"+
			" members, they can be found at the top of our members listing from Moderators and up. I am Fishsticks, the server's liaison - here to aid in whatever may need to be done! "+
			"If you should have questions concerning me, ask " + ranger + ".\n\n"+
			"Note that as a newcomer to our server, you will be limited in your abilities until granted the Recognized role. How do you get it? Join a voice channel and get to know people!"	
	);

	//SEND USER A PRIVATE MESSAGE CONCERNING GENERAL CCG RULES
	var newMemberInfoPanel = new Discord.RichEmbed();
		newMemberInfoPanel.setTitle("o0o - Welcome! - o0o");
		newMemberInfoPanel.setColor(config.fscolor);
		newMemberInfoPanel.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png");
		newMemberInfoPanel.setDescription(
			"Greetings newcomer!\n\n"+
			"My name is Fishsticks, the CCG server liason. Yes, I know, I'm a bot. This has no effect on our relationship I should hope though. Either way, I justed wanted"+
			" to let you know what the down low is concerning our happy community here. We've got ground rules and those rules are enforced by both me and our staff members."+
			" All staff members and moderators are shown in our members list from the top down to members. Any questions you may have can be asked to these members. I can only do"+
			" so much you know, lol. Anyways, have a review of these rules:\n"+
			"1. Follow all general conduct rules\n"+
			"2. Be respectful of others. If someone doesn't like you behavior, stop or move to a new channel.\n"+
			"3. Please only stream or record in a channel after obtaining permission from others in the channel to do so.\n\n"+
			"More information concerning these can be found under the `!rules` command.\n\n"+
			"As a further note, since you are a newcomer to this community: your permissions are limited until granted the Recognized role. The CCG community does not tolerate" + 
			" invasive/malicious trolls in the slightest and will be permabanned on the first offense. Talk powers for Newcomers are removed temporarily." + 
			"Join voice channels and talk to people, show"+
			" that you can be trusted and you will be granted further rights.\n\n"+
			"Please also note that as a Discord user, you also agree to their terms of service. [Review them here](https://discordapp.com/guidelines)."
		);
	member.sendMessage({embed: newMemberInfoPanel});
	

	console.log("+USER: " + member.user.username + " joined the server.");
	crashpad.send({embed: join});
	syslog("+USER: " + member.user.username + " joined the server.", 1);

});

//POLLING SYSTEM, NON-DUPLICATE SYSTEM
fishsticks.on('messageReactionAdd', (postReaction, reactor) => {

	if (reactor.id == fishsticks.user.id) {
		return;
	}

	console.log("[POLL SYSTEM] Potential Poll reponse flag. Details: \n"+
		"\tMessage ID: " + postReaction.message.id);
	syslog("[POLL SYSTEM] Potential Poll reponse flag. Details: \n"+
		"\tMessage ID: " + postReaction.message.id, 1);

	console.log("[POLL SYS] Sifting through poll keys...");
	syslog("[POLL SYS] Sifting through poll keys...", 1);

	let pollFile = JSON.parse(fs.readFileSync('./Modules/PollingSystem/polls.json', 'utf8'));

	for (pollItem in pollFile.polls) { //Sort through each poll
		if (postReaction.message.id == pollFile.polls[pollItem].pollID) { //If the poll ID is the same as the reacted to message
			for (reactorID in pollFile.polls[pollItem].responders) { //Sort through poll respondents
				if (reactor.id == pollFile.polls[pollItem].responders[reactorID]) { //If a responder is found to be already in the list
					postReaction.remove(fishsticks.users.get(reactor.id)); // Remove duplicate responder
					return postReaction.message.channel.send("Hey " + reactor + ", don't vote more than once!").then(sent => sent.delete(7000));
				}
			}

			console.log("[POLL SYS] Reponse recorded");
			syslog("[POLL SYS] Response recorded.", 1);
			pollFile.polls[pollItem].responders.push(reactor.id);
		}
	}

	fs.writeFileSync('./Modules/PollingSystem/polls.json', JSON.stringify(pollFile));
});

//POLLING SYSTEM, REMOVE VOTE
fishsticks.on('messageReactionRemove', (postReaction, reactor) => {
	if (reactor.id == fishsticks.user.id) {
		return;
	}

	console.log("[POLL SYSTEM] Potential Poll reponse flag. Details: \n"+
		"\tMessage ID: " + postReaction.message.id);
	syslog("[POLL SYSTEM] Potential Poll reponse flag. Details: \n"+
		"\tMessage ID: " + postReaction.message.id, 1);

	console.log("[POLL SYS] Sifting through poll keys...");
	syslog("[POLL SYS] Sifting through poll keys...", 1);

	let pollFile = JSON.parse(fs.readFileSync('./Modules/PollingSystem/polls.json', 'utf8'));

	for (pollItem in pollFile.polls) { //Sort through each poll
		if (postReaction.message.id == pollFile.polls[pollItem].pollID) { //If the poll ID is the same as the reacted to message
			for (reactorID in pollFile.polls[pollItem].responders) { //Sort through poll respondents
				if (reactor.id == pollFile.polls[pollItem].responders[reactorID]) { //If a responder is found to be already in the list
					console.log("[POLL SYS] Current respondents: " + pollFile.polls[pollItem].responders.length);

					pollFile.polls[pollItem].responders.splice(reactorID, 1);

					console.log("[POLL SYS] Response removed.");
					syslog("[POLL SYS] Response removed.", 1);
					postReaction.message.channel.send(reactor + ", response removed.").then(sent => sent.delete(10000));

					console.log("[POLL SYS] Current respondents: " + pollFile.polls[pollItem].responders.length);
				}
			}
		}
	}

	fs.writeFileSync('./Modules/PollingSystem/polls.json', JSON.stringify(pollFile));
});

try {
	fishsticks.login(token);
}
catch (logErr) {
	console.log(colors.red("[FATAL] There's a problem with the login!"));
}