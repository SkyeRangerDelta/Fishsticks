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
const chs = require('./Modules/fs_channels.json');
const config = require('./Modules/Core/corecfg.json');

const token = systems.token;
const fscolor = config.fscolor;
const fsemercolor = config.fsemercolor;
const prefix = config.prefix;

//ENGINEERING MODE
let engmode = false;

//BOT GLOBAL VARIABLES
fishsticks.tempChannels = [];
fishsticks.version = sys.fsversion;
fishsticks.queue = new Map();
fishsticks.servStatus;
fishsticks.mattybmode = true;
fishsticks.playrejects = 0;
fishsticks.commandAttempts = 0;
fishsticks.commandSuccess = 0;
fishsticks.CCGuild = fishsticks.guilds.get("125677594669481984");
fishsticks.guildID = "125677594669481984";
fishsticks.musicPlaying = false;
fishsticks.vc;

//CHANNEL INITIALIZATIONS
var fsconsoleChannel;
var announceChannel;
var fstempchclone;
var staffChannel;
var hangoutch;
var crashpad;
var moderator;

//ROLE INITIALIZATIONS
let newcomer;
let staff;

//USER INITIALIZATIONS
var ranger;

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

	//CHANNEL DEFINITIONS
	fsconsoleChannel = fishsticks.channels.get(chs.fsconsole);
	announceChannel = fishsticks.channels.get(chs.announcements);
	staffChannel = fishsticks.channels.get(chs.staffChannel);
	hangoutch = fishsticks.channels.get(chs.hangout);
	crashpad = fishsticks.channels.get(chs.crashpad);
	moderator = fishsticks.channels.get(chs.moderator);

	//USER DEFINITIONS
	ranger = fishsticks.users.get("107203929447616512");

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

var svuArr = ["fishsticks is bad", "fishsticks are bad", "fishsticks are gross", "fishsticks eww", "hate fishsticks", "fishsticks is nasty", "fishsticks are nasty", "fishsticks shush up", "shut up fishsticks", "fishticks shut up", "fishsticks, shut up", "caught fishsticks", "fishsticks is a girl", "fishsticks a girl"];

//MESSAGE AND EVENT SYSTEMS
fishsticks.on('message', async msg => {

	//TWITCH DOMAIN SCREEN
	if (((msg.content.includes("streaming now")) || ((msg.content.includes("twitch")) && (msg.content.includes(".tv"))))) {
		if (msg.member.roles.find("name", "The Nod")) {
			msg.reply("Post clearance granted, you have *The Nod*.").then(sent => sent.delete(10000));
		}
		else if (msg.member.roles.find("name", "Staff")) {
			msg.reply("Post clearance overridden by Staff. I'd look into getting *The Nod*.").then(sent => sent.delete(10000));
		}
		else {
			msg.delete();

			msg.reply("Post unauthorized and cleared. You need *The Nod* before posting Twitch links! See `!rules`.").then(sent => sent.delete(20000));
		}
	}

	//PASSIVE COMMANDS
	//--> Administrative achrules: Shows rules in the #rules channel
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
				"[Discord Server Invite Link](http://discord.ccgaming.com/)\n"
			);
			achrules.addField("Fishsticks & Discord Help:",
				"[Complete Discord Guide (Forum Post)](https://forums.ccgaming.com/viewtopic.php?f=2&t=24357)\n"+
				"[Complete Discord Reference (KBase Article)](https://forums.ccgaming.com/kb/viewarticle?a=2)\n"+
				"[Fishsticks Official Wiki Page](https://wiki.pldyn.net/index.php/Fishsticks)\n"+
				"[KBase Article](https://forums.ccgaming.com/kb/viewarticle?a=3)\n"
			);

		msg.channel.send({embed: achrules});
	}

	if (msg.content == "ni hao" || msg.content == "Ni Hao" || msg.content == "Ni Hao Ma" || msg.content == "ni hao ma") {
		msg.reply("Hao!");
		fishsticks.commandSuccess++;
		return;
	}

	if (msg.content.toLowerCase() == "hello there") {
		msg.reply("General Kenobi", {files: ["./images/grievous.gif"]});
		fishsticks.commandSuccess++;
		return;
	}

	if (msg.content == "Order 66" || msg.content == "order 66") {
		msg.channel.send("**Execute all the Jedis**", {files: ["./images/dewit.gif"]});
		fishsticks.commandSuccess++;
		return;
	}

	if (msg.content.toLocaleLowerCase() == "fire phasers") {
		msg.channel.send("**Aye Captain; firing all phaser banks.**", {files: ["./images/phasers.gif"]});
		fishsticks.commandSuccess++;
		return;
	}

	if (msg.content.includes("good music") || msg.content.includes("great music")) {
		msg.channel.send("*Did someone say, `music`?*", {files: ["./sounds/sepWays.mp3"]});
		fishsticks.commandSuccess++;
		return;
	}

	for (var i = 0; i < svuArr.length; i++) {
		if (msg.content.includes(svuArr[i])) {
			msg.reply("Excuse me!? We are going to have to have a talk about where your standards lie and where they should be. Keep that attitude up and I'll have to take extra measures... (automatic 15 respect point loss).\n\n *Very idea...\nHating fishsticks...*")
		}
		return;
	}

	if (msg.content.includes("thonk")) {

		if (msg.author.id == fishsticks.user.id) return
		msg.react(fishsticks.emojis.find("name", "thonk"));

		msg.channel.send("Hehe. *Thonk*", {files: ["./images/thonk.png"]});
		fishsticks.commandSuccess++;
		return;
	}
	else { //MESSAGE COMMAND HANDLER
		if (msg.author.fishsticks) return
		if (msg.author.id == fishsticks.user.id) return

		const pcmd = msg.content.split(" ");
		const cmd = msg.content.slice(prefix.length).trim().split(/ +/g);
		const cmdID = cmd.shift().toLowerCase();
	
		//ACTIVE COMMANDS
		if (msg.content.charAt(0) == prefix) {
			console.log("[ACT-COMM] Attempting Resolution for command: " + cmdID);
			fishsticks.commandAttempts++;
			try {
				let cmdFile = require(`./Commands/Active/${cmdID}.js`);
				cmdFile.run(fishsticks, msg, cmd);
				console.log("[ACT-COMM] Success")
				fishsticks.commandSuccess++;
			}
			catch (err) {
				console.log("[ACT-COMM] Failed:\n" + err);
				msg.reply("You trying to thonk me? That's not a command! Use `!help` to get a reference.");
			}
		}
		else {//PASSIVE COMMANDS
			console.log("[PAS-COMM] Attempting Resolution for command: " + pcmd[0]);
			fishsticks.commandAttempts++;
			try {
				let pCmdFile = require(`./Commands/Passive/${pcmd[0]}.js`);
				pCmdFile.run(fishsticks, msg, cmd);
				console.log("[PAS-COMM] Success");
				fishsticks.commandSuccess++;
			} catch (err) {
				console.log("[PAS-COMM] Failed: " + err);
			}
		}
	}
});

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

//MEMBER JOIN/LEAVE SYSTEM
fishsticks.on('guildMemberAdd', member => {

	//DEFINE GUILD
	server = member.guild;

	//DEFINE NEWCOMER
	newcomer = server.roles.find('name', 'Newcomer');

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

	console.log("+USER: Attempting to attach Newcomer role...");
		
	//ADD NEWCOMER TO USER AND CATCH POTENTIAL ERROR
	member.addRole(newcomer).catch(attacherror => {
		var newcomerAlert = new Discord.RichEmbed();
			newcomerAlert.setTitle("o0o - NEWCOMER WARNING - o0o");
			newcomerAlert.setColor(fsemercolor);
			newcomerAlert.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png");
			newcomerAlert.setDescription("HEY, @here ! A new user joined but Fishsticks encountered an error.");
			newcomerAlert.addField("Fishsticks failed to assign the user the newcomer role!", "The new user, " + member.user.username + "cannot see anything! Put this to remedy NOW! You may need to DM them to let them know that the problem has been solved.");

		moderator.send({embed: newcomerAlert});

		console.log(attacherror);
	});

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
			"As a further note, since you are a newcomer to this community: your permissions are limited until granted the Recognized role. Join voice channels and talk to people, show"+
			" that you can be trusted and you will be granted these rights.\n\n"+
			"Please also note that as a Discord user, you also agree to their terms of service. [Review them here](https://discordapp.com/guidelines)."
		);
	member.sendMessage({embed: newMemberInfoPanel});
	

	console.log("+USER: " + member.user.username + " joined the server.");
	crashpad.send({embed: join});
});

fishsticks.login(token);