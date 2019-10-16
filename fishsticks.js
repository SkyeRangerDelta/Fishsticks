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
const syslogcore = require('./Modules/Functions/syslog.js');
const pollInit = require('./Modules/PollingSystem/initPolls.js');
const currDateTime = require('./Modules/Functions/currentDateTime.js');
const dbTest = require("./Modules/Functions/db/db_Test.js");
const query = require('./Modules/Functions/db/query.js');

const cmdResponses = require('./Modules/SystemResponses/commandErrors.json');

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
fishsticks.dbaseConnection;
fishsticks.debaterMsgIDs = [];

fishsticks.commandRejects = 0;
fishsticks.rejectingCommands = false;

//FS GLOBAL HS VARIABLES
fishsticks.cardsPlayed = [];
fishsticks.brodemode = false;

//SESSION/ENGM MANAGER
var fsvarsdoc = JSON.parse(fs.readFileSync('./session_id.json', 'utf8'));
var fs_session = fsvarsdoc.sessionnum++;
fishsticks.syssession = fs_session;

fs.writeFileSync("./session_id.json", JSON.stringify(fsvarsdoc));

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
	["gamerole", true],
	["sqlsys", true],
	["acctsys", true],
	["loggersys", true]
]);

//INITIALIZE POLLS
pollInit.run(fishsticks, "init");

//CHANNEL INITIALIZATIONS
var fsconsoleChannel;
var crashpad;

fishsticks.systemLog;

//ROLE INITIALIZATIONS

//USER INITIALIZATIONS
var ranger;

//DATABASE CONNECTION
dbTest.run(fishsticks);

//RANDOM MESSAGES
let regenCountRefresh = Math.random() * (2000 - 25) + 25;

//--------------------------------------
//............MAIN SCRIPT...............
//--------------------------------------

//STARTUP PROCEDURE
fishsticks.on('ready', () => {

	//CHANNEL DEFINITIONS
	fsconsoleChannel = fishsticks.channels.get(chs.fsconsole);
	announceChannel = fishsticks.channels.get(chs.announcements);
	ecChannel = fishsticks.channels.get(chs.ecChannel);
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

	//SUBROUTINES CHECK
	subrouts.run(fishsticks);

	//LOGGER INITIALZE
	function syslog(message, level) {
		syslogcore.run(fishsticks, message, level);
	}

	//Startup Message - Console
	syslog(`Successfully Logged ${fishsticks.user.tag} into the server\nInitialized and booted Fishsticks version ` + 
		fishsticks.version + `\n===========================================================`, 0);
	syslog(`[SESSION#] ` + fishsticks.syssession, 0);
	syslog(`[ENG-MODE] Currently: ` + engmode, 0);
	syslog(`[*SUBR-CON*] Subroutines initialized and configured`, 1);

	//Checking database state
	console.log("[DB-TEST] DB State: " + fishsticks.dbaseConnection);

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
		syslogcore.run(fishsticks, message, level);
	}
	catch (err) {
		systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
	}
}

//----------------------------------
//FISHSTICKS COMMAND SYSTEMS
//----------------------------------

let svuArr = ["shut up", "hush", "go away", "stop", "shoosh", "be quiet", "dummy", "sucks"];

//MESSAGE AND EVENT SYSTEMS
fishsticks.on('message', async msg => {

	//Random message generator
	regenCountRefresh--;
	if (regenCountRefresh == 0) {
		regenCountRefresh = Math.random() * (2000 - 25) + 25;
		console.log("[RDMNUMGEN] A new random context quote interval has been generated - " + regenCountRefresh);
		generateRandomQuote(msg);
	}

	//DEBATER CHECK
	if (msg.channel.id == chs.discussionden) {

		let messageDeleted;

		if (msg.author.id == fishsticks.user.id) return
		if (msg.author.fishsticks) return

		if (!msg.member.roles.find("name", "Debater")) {

			messageDeleted = msg.content;

			msg.delete();

			let debaterPanel = new Discord.RichEmbed();
				debaterPanel.setTitle("o0o - Discussion Den Rules - o0o");
				debaterPanel.setColor(config.fscolor);
				debaterPanel.setFooter("This message has been sent to you because you've tried posting in the Discussion Den without having the Debater role.");
				debaterPanel.setDescription(
					"As you are apart of CC, it is my pleasure to permit you access to this free-fire zone of discussion that we call the Discussion Den."+
					" *I personally would have liked to call it the Agora, but whatever.* But before I can let you post anything in there, I need you to understand that "+
					"there are some specifics that you need to agree to. I won't ramble on, but this is the gist of it.\n\n"+
					"- This is a free-fire zone. If you get butthurt, don't go to Staff. If you can't take the heat, get out of the kitchen.\n"+
					"- Do not dominate the discussion. There's a difference between a conversation, a debate, and an absolute massacre.\n" +
					"- Obey staff. I will ban you from this channel if you don't.\n"+
					"- There are ramifications to permitting this channel; one of them is that you don't ignite flaming political discussions...at least all the time.\n"+
					"- Following the above, do not troll this channel. This is intended for some of the most serious discussion. **DO NOT TROLL THIS CHANNEL OR I WILL BAN YOU FROM CC.**\n\n"+
					"Right, I think that's it then. If you agree with these rules, slap that happy emoji down there and I'll give you that noice shiny debater role. Note that this can be removed with like 2 clicks."
				);

			msg.author.send({embed: debaterPanel}).then(sent => {
				sent.react("✅");
				fishsticks.debaterMsgIDs.push(sent.id);
			});

			msg.author.send("For your convenience (and possibly some potential headache and rage), this was the message you posted"+
							" to the Discussion Den. \n\n```" + messageDeleted + "```");

			return msg.reply("You need to be a debater to have post permissions here!").then(sent => sent.delete(10000));
		}
	}

	if (msg.channel instanceof Discord.DMChannel) { //ALPHA LEVEL COMMANDS
		if (msg.author.bot) return
		if (msg.author.id == fishsticks.user.id) return
		if (msg.author.fishsticks) return

		if (msg.author.id == chs.ranger) {
			console.log(colors.red("[ALPHA LEVEL] Incoming Command: " + msg))
			syslog("[ALPHA LEVEL] Incoming Command " + msg, 4);
			return msg.channel.send("Greetings. Attempting to process command...");
		} else {
			if (msg.content == "I accept the rules of the den.") {
				return fishsticks.CCGuild.member(msg.author).addRole(fishsticks.CCGuild.roles.find("name", "Debater")).then(done => {
					msg.channel.send("Debater role added!").then(sent => sent.delete(10000));
				});
			} else {
				return msg.channel.send("Only commands please. :D").then(sent => sent.delete(10000));
			}
		}
	}
	else { //NON-ALPHA LEVEL COMMANDS

		
		//NEWCOMER LINK SCREEN
		try {
			if (fishsticks.subroutines.get("nlinkscn")) {
				if (msg.member.roles.size === 1) {
					if (msg.content.includes(".com") || msg.content.includes(".net") || msg.content.includes(".org") || msg.content.includes(".tv")) {
						syslog("[N. LINK SCREEN] Newcomer Link Intercepted." + msg, 2);
						msg.delete();
						msg.reply("As a newcomer to this server, your permissions to post links are revoked. You may post links once you are granted the Recognized role.").then(sent => sent.delete(20000));
					}
				}
			}
		} catch (newcomerLinkErr) {
			syslog("[N. LINK SCREEN] [ERROR] Something went wrong.\n\n" + newcomerLinkErr, 3);
		}

		//TWITCH DOMAIN SCREEN
		try {
			if (fishsticks.subroutines.get("twitch")) {
				if (((msg.content.includes("streaming now")) || ((msg.content.includes("twitch")) && (msg.content.includes(".tv"))))) {

					if (msg.author.id == fishsticks.user.id) {
						return;
					}

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
			syslog("[TWITCH-SCREEN] [ERROR] Something has gone wrong.\n\n" + twitchScreenErr, 3);
		}

		//GAME ROLE CHECK
		if (msg.mentions.roles.size != 0) {

			if (msg.author.id == fishsticks.user.id) {
				return;
			}

			let rolesList = await query.run(fishsticks, `SELECT roleDiscordID, pings FROM fs_gr_Roles WHERE official = 1;`);

			for (rolesItem in rolesList) {
				if (msg.mentions.roles.has(rolesList[rolesItem].roleDiscordID)) {
					let roleUpdateResponse = await query.run(fishsticks, `UPDATE fs_gr_Roles SET lastPing = '${currDateTime.run(fishsticks)}', 
						pings = ${rolesList[rolesItem].pings + 1} WHERE roleDiscordID = ${rolesList[rolesItem].roleDiscordID}`);
				}
			}
		}

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
				if (msg.content.toLowerCase().includes(svuArr[i]) && ((msg.content.toLowerCase().includes('fishsticks') || msg.content.toLowerCase().includes('fishy')))) {
					msg.reply("Excuse me!? We are going to have to have a talk about where your standards lie and where they should be. Keep that attitude up and I'll have to take extra measures... (automatic 15 respect point loss).\n\n *Very idea...\nHating on fishsticks...*")
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
						await verifyMember();
						console.log(colors.green("[ACT-COMM] Attempting Resolution for command: " + cmdID));
						syslog("[ACT-COMM] Attempting Resolution for command: " + cmdID, 0);
						fishsticks.commandAttempts++;
						try {
							let cmdFile = require(`./Commands/Active/${cmdID}.js`);
							cmdFile.run(fishsticks, msg, cmd);
							console.log(colors.green("[ACT-COMM] Success"));
							syslog("[ACT-COMM] Success", 0);
							fishsticks.commandSuccess++;
							fishsticks.rejectingCommands = false;
							fishsticks.commandRejects = 0;
							handleMember("succeeded");
						}
						catch (err) {
							console.log(colors.yellow("[ACT-COMM] Failed:\n" + err));
							syslog("[ACT-COMM] Failed:\n" + err, 3);
							fishsticks.rejectingCommands = true;
							
							if (fishsticks.commandRejects < 11) {
								msg.reply(cmdResponses.commandErrors[fishsticks.commandRejects]).then(sent => sent.delete(15000));
							} else {
								msg.reply("You brought this on yourself! -" + Math.pow(fishsticks.commandRejects, 2) + " points!").then(sent => sent.delete(15000));
							}

							fishsticks.commandRejects++;
							handleMember("issued");
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
						syslog("[PAS-COMM] Attempting Resolution for command: " + pcmd[0], 0);
						fishsticks.commandAttempts++;
						try {
							let pCmdFile = require(`./Commands/Passive/${pcmd[0]}.js`);
							pCmdFile.run(fishsticks, msg, cmd);
							syslog("[PAS-COMM] Success", 0);
							fishsticks.commandSuccess++;
						} catch (err) {
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

	//HANDLE MEMBER FUNCTIONS - FISHSTICKS ONLINE
	async function handleMember(state) {
		syslog("[FS-ONLINE] Syncing member stats...", 1);

		let commandsIssued;
		let commandsSucceeded;
		let memberID;

		//Get the member
		let member = await query.run(fishsticks, `SELECT * FROM fs_members WHERE memberDiscordID = ${msg.author.id}`);
		commandsIssued = member[0].commandsIssued;
		commandsSucceeded = member[0].commandsSucceeded;
		memberID = member[0].memberID;

		if (state == "issued") {
			let incrementIssues = await query.run(fishsticks, `UPDATE fs_members SET commandsIssued = ${commandsIssued + 1} WHERE memberID = ${memberID};`);
		} else if (state == "succeeded") {
			let incrementSuccesses = await query.run(fishsticks, `UPDATE fs_members SET commandsSucceeded = ${commandsSucceeded + 1} WHERE memberID = ${memberID};`);
			let incrementIssues = await query.run(fishsticks, `UPDATE fs_members SET commandsIssued = ${commandsIssued + 1} WHERE memberID = ${memberID};`);
		}

		syslog("[FS-ONLINE] Sync complete.", 1);
	}

	async function verifyMember() {

		syslog("[FS-ONLINE] Verifying member record...");

		let memberStandardNickname = msg.author.tag.substring(0, msg.author.tag.length - 5);

		//Process getting member
		let memberResponse = await query.run(fishsticks, `SELECT 1 FROM fs_members WHERE memberDiscordID = ${msg.author.id};`);
		//If member doesn't exist, create the record
		if (memberResponse[0] == null || memberResponse == undefined) {
			syslog("[FS-ONLINE] Creating new member record with values...\n\tDiscord ID: " + msg.author.id + "\n\tNickname: " + memberStandardNickname + "\n\tTag: " + msg.author.tag, 2);
			let memberCreation = await query.run(fishsticks, `INSERT INTO fs_members (memberDiscordID, memberNickname, memberTag, commandsIssued, commandsSucceeded, passivesSucceeded, suggestionsPosted) VALUES (${msg.author.id}, '${memberStandardNickname}', '${msg.author.tag}', 0, 0, 0, 0);`);
		}

		syslog("[FS-ONLINE] Verification complete.");
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

	//Check if debater report
	syslog("[DEBATE-SYS] Checking IDs...", 2);
	for (id in fishsticks.debaterMsgIDs) {
		if (postReaction.message.id == fishsticks.debaterMsgIDs[id]) {
			try {
				roleToAdd = fishsticks.CCGuild.roles.find("name", "Debater");
				guildMem = fishsticks.CCGuild.fetchMember(reactor).then(debater => debater.addRole(roleToAdd));
				postReaction.message.channel.send("Done!");
				return fishsticks.debaterMsgIDs.splice(id, 1);
			} catch (addRoleErr) {
				postReaction.message.channel.send("Hmmmm, something's not right. Ask SkyeRanger to do this instead. I'm...not alright.");
				console.log(addRoleErr);
			}
		}
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


//-----------------------------------
//HELPER METHODOLOGIES
//-----------------------------------
let randomQuotes = ["This is literally the exact opposite of what you told me earlier.", "WE HAVE FAILED THIS CITY.", "We free if you is.",
	"I straight up stabbed my self in the face with a fork.", "I laid on my chapstick and it pinched my belly.", 
	"When y'all eat peanut butter do you smell like peanut butter the next day?", "I stabbed myself with an eggshell.", "I think I almost got frostbite at 51­­°F.",
	"A bird saw me naked and now I'm uncomfortable.", "The white stuff is powdered sugar not cocain btw", "Sometimes I like to open and close doors for fun.",
	"Do any of y'all wake up with your phone charger around your neck sometimes?", "Well don't murder me! I'm an unsaved soul!", "Confession may be good for the soul but it isn't for hubby's who don't pay attention.",
	"'You're an elf!'\n'That doesn't mean I can't wear pants!'", "Change your name to predator chair.", "Switch party and quaker.", "Always have a trash can", "When cutting anything measure twice, interrogate the man who measured, and then maybe cut when you're absolutely sure nobody made a mistake... make a mistake anyway.",
	"In the 70s, attics were a myth, and instead there are tiny crawlspaces where an attic should be.", "Nail guns can jam, don't let your friend continue to smack the wall with compressed air while the nails bend further and further and the jam becomes a scientific marvel.", 
	"V6 engine accessories will fit on a V8 engine... do not buy a V8 belt for them.", "No, I would run home and let you die.", "When will you people learn...\nTHAT YOUR THONKS HAVE CONSEQUENCES.", "Love you Dodge, but don't tell anybody!",
	"The problem is Windows wanting to make a massive amount of fake RAM.", "So, there was a post that discussed cutting Listerine tablets into circles and replacing your friend's eye contacts with them.\n\nI couldn't say 'Minty fresh eyeballs with a straight face.\n\nSuch freshness.",
	"I was |this| close to killing a fellow CM.", "I'm a part-time Protoss.", "I'm Mary Poppins y'all!", "Hi! I'm Kesa and I make questionable decisions!", "Ever notice how Skye's initial response problems is 'let me take it down and I'll fix it' and Kesa's reponse is 'ban it'.",
	"Wow, I go to work for five hours and Skye's bot deletes his car.", "The bot promptly began yelling at itself.", ":facepalm:", "Neo even opened an issue about it. The dilemma has been resolved by simply turning him purple.",
	"I like to think of chat like a tree. Sometimes the tree gets moving from a gust of wind blowing through the branches. Sometimes the tree is surrounded by other beings that interact with the tree or just hang out around it. And SOMETIMES, a fire is accidentally lit by the tree, and the whole forest comes alive! :laughing:",
	"Alrighty. I'll stick with ~~Barbie~~ Narnia :thumbsup:\n\n(*autocorreeeeeect*)", "I'm 100% prepared to unleash horrible horrors on the world.", "Maybe I should stop ordering ice cream through amazon :thonk:", "I assure you there are much worse things than Star Trek aliens.\n\nRocketChair's teamkilling in PUBG, for example.",
	"Allo, do I need to lock you in your room again?", "Allo is beating people up on my behalf. I don't know how to respond.", "Does this make me a gang leader?", "I was going to say I'm the most beautiful woman in the room, but...\n\nLet me go get my banhammer.", "Mom, strangers on the internet are telling me to starve myself.",
	"*What did I just walk into? The first thing I heard was poop and chicken sandwich.*", "You are all terrible people.", "I am the keeper of the secret ammo, wielder of the flame of America. The dark fire will not avail you, Flame of Communism!!!!", "'Grenade'\n\n'No David, I didn't do it on purpose.", "*Skye, did you just call us problems.*",
	"======================,,,============================================================================================================================-===================================,====================,='", "'Where is your accent from?'\n\n'I don't have one'\n\n*Skye's dad doing a stereotypical southern accent in the background*",
	"`The Nod: A role used explicitly by Fishsticks to grant Twitch links to be allowed in chat. Links sent my users without the Nod are breaking rule D of self-advertising.` To acquire the role, it must be granted by a staff member. To be deemed worthy of the role....you gotta, well...talk to some staff peoples.", "So begins the great corner controversy of 2019.",
	"Alex, I'll take necessities I don't get for 400", "I'm with Skye. Take your princess to another castle!", "Yep, take your female friend and skeedaddle.", "Since when does glitter = vampie", "The power of the cow", "Request of the night: that nobody wrote down Football's credit card number.",
	"I'm playing a sadistic game of whack-a-mole with my car.", "'Tier one Christian here'", "All 'good' things come to an end, because we have not yet attained perfection. Once we're there, then the party don't stop.", "'To go all Paul on someone'", "Next week, I will teach you all how to Baptist. Because we're gonna be here so long, I'm gonna ask each of you to bring a covered dish and a dessert.",
	"'Wait, what' moment.", "'Big Decision Minefield'", "Independent Baptist that don't need no man.", "Compassion unawares", "I'd throw them all in a pit and tell them they can come out when they actually open a Bible and read it.", "'A Christian's life is not good because of his circumstances. It is good in spite of them.'",
	"Big, shiny person right outside Damascus.", "The kick wasn't mine.\nAnd no, I can't rhyme.\nThat was the last time.", "Too much effort anyway.", "Sorry, too busy trying to log into my developer Discord site and changing the Fishsticks logo to the amazing one you didn't do.", "ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
	"I personally took a chance on a few, but they were calculated risks.", "I was proud of everyone. Lot's of puns, but most were above average.", "Everything about this is terrible.", "I have a bag of snowflakes in my freezer marked as 'rescued snow.' It makes me happy to know they're in a better place than they would be with him.",
	"THE WHOLE PIE.", "'If you need Christianity made wierd, talk to Amroth.'", "The image of Bob as a migraine dispelling wizard is all I can think of now.", "It created the role...and then proceeded to go insane."]

function generateRandomQuote(msg) {
	let msgNumber = Math.floor(Math.random() * randomQuotes.length);
	console.log("[RDM-QUOTE GEN] Firing off message number " + msgNumber + " to the " + msg.channel.name);
	msg.channel.send(randomQuotes[msgNumber]);
}

function calibrateSubroutines() {

}