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
	fsconsoleChannel = fishsticks.channels.get(channels.fsconsole);
	announceChannel = fishsticks.channels.get(channels.announcements);
	staffChannel = fishsticks.channels.get(channels.staffChannel);
	hangoutch = fishsticks.channels.get(channels.hangout);
	crashpad = fishsticks.channels.get(channels.crashpad);
	moderator = fishsticks.channels.get(channels.moderator);

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
	if (msg.content == "ni hao" || msg.content == "Ni Hao" || msg.content == "Ni Hao Ma" || msg.content == "ni hao ma") {
		msg.reply("Hao!");
	}

	if (msg.content == "Order 66" || msg.content == "order 66") {
		msg.channel.send("**Execute all the Jedis**", {files: ["./images/dewit.gif"]});
	}

	if (msg.content == "fire phasers " || msg.content == "Fire Phasers" || msg.content == "Fire phasers") {
		msg.content.send("**Aye Captain; firing all phaser banks.", {files: ["./images/phasers.gif"]});
	}

	if (msg.content.includes("good music") || msg.content.includes("great music")) {
		msg.channel.send("*Did someone say, `music`?*", {files: ["./sounds/sepWays.mp3"]});
	}

	for (var i = 0; i < svuArr.length; i++) {
		if (msg.content.includes(svuArr[i])) {
			msg.reply("Excuse me!? We are going to have to have a talk about where your standards lie and where they should be. Keep that attitude up and I'll have to take extra measures... (automatic 15 respect point loss).\n\n *Very idea...\nHating fishsticks...*")
		}
	}

	if (msg.content.includes("thonk")) {

		if (msg.author.id == fishsticks.user.id) return
		msg.react(fishsticks.emojis.find("name", "thonk"));

		msg.channel.send("Hehe. *Thonk*", {files: ["./images/thonk.png"]});
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
			try {
				let cmdFile = require(`./Commands/Active/${cmdID}.js`);
				cmdFile.run(fishsticks, msg, cmd);
				console.log("[ACT-COMM] Success")
			}
			catch (err) {
				console.log("[ACT-COMM] Failed:\n" + err);
				msg.reply("You trying to thonk me? That's not a command! Use `!help` to get a reference.");
			}
		}
		else {//PASSIVE COMMANDS
			console.log("[PAS-COMM] Attempting Resolution for command: " + pcmd[0]);
			try {
				let pCmdFile = require(`./Commands/Passive/${pcmd[0]}.js`);
				pCmdFile.run(fishsticks, msg, cmd);
				console.log("[PAS-COMM] Success");
			} catch (err) {
				console.log("[PAS-COMM] Failed: " + err);
			}
		}
	}
});

/*
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
		
	member.addRole(newcomer).catch(attacherror => {
		var newcomerAlert = new Discord.RichEmbed();
			newcomerAlert.setTitle("o0o - NEWCOMER WARNING - o0o");
			newcomerAlert.setColor(fsemercolor);
			newcomerAlert.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png");
			newcomerAlert.setDescription("HEY, @here ! A new user joined but Fishsticks encountered an error.");
			newcomerAlert.addField("Fishsticks failed to assign the user the newcomer role!", "The new user, " + member.user.username + "cannot see anything! Put this to rememdy NOW! You may need to DM them to let them know that the problem has been solved.");

		moderator.send({embed: newcomerAlert});

		console.log(attacherror);
	});

	console.log("+USER: " + member.user.username + " joined the server.");
	crashpad.send({embed: join});
});

fishsticks.login(token);