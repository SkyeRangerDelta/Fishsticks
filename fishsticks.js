//============================================
//				 FISHSTICKS
//		 The official Christian Crew
//			 Gaming Discord Bot
//
//		 Developed & Maintained by
//			  SkyeRangerDelta
//--------------------------------------------
//			https://ccgaming.com/
//
//		This is a custom designed bot
//		 built for the CCG Community.
//=============================================

//=============================================
//				DEPENDENCIES
//=============================================
//Libraries
const Discord = require('discord.js');
const schedule = require('node-schedule');

//Modules
const { startUp } = require('./Modules/Core/Core_Ready');
const { log } = require('./Modules/Utility/Utils_Log');
const { processMessage } = require('./Modules/Core/Core_Message');
const { validateReaction, doDailyPost } = require('./Modules/Utility/Utils_Aux');
const { handleNewJoin } = require('./Modules/Core/Core_NewJoin');
const { handleOldMember } = require('./Modules/Core/Core_OldMember');

//Configs
const { token } = require('./Modules/Core/Core_config.json');
const { validateChannel } = require('./Commands/Active/tempch');

//=============================================
//				  GLOBALS
//=============================================

//Client
const Fishsticks = new Discord.Client();

//Client Variables
Fishsticks.FSO_CONNECTION = null;
Fishsticks.FSO_STATE = null;
Fishsticks.FSO_VALID = null;
Fishsticks.session;
Fishsticks.lastSystemStart;
Fishsticks.CCG;
Fishsticks.RANGER;
Fishsticks.CONSOLE;
Fishsticks.appMsgIDs = [];
Fishsticks.debMsgIDs = [];
Fishsticks.TESTMODE = false;
Fishsticks.NODEARGS = [];
Fishsticks.SUMM_BRODEMODE = false;

//=============================================
//				   EVENTS
//=============================================

//Primary

//Online and Ready
Fishsticks.once('ready', async () => {
	await startUp(Fishsticks);
});

//Error
Fishsticks.on('error', async (fs_err) => {
	log('err', `[CLIENT] ${fs_err}`);
});

//Warning
Fishsticks.on('warn', async (fs_warn) => {
	log('warn', `[CLIENT] ${fs_warn}`);
});

//Message
Fishsticks.on('message', async (msg) => {
	if (msg.author === Fishsticks.user) return;
	if (msg.author.bot) return;

	processMessage(Fishsticks, msg);
});

//Secondary

//Voice Channel Change
Fishsticks.on('voiceStateUpdate', (prevMemberState, newMemberState) => {
	log('info', `[CLIENT] [VC STATE] ${prevMemberState.channelID} : ${newMemberState.channelID}`);

	//Trigger tempch check
	if (prevMemberState.channelID != null) {
		validateChannel(Fishsticks, prevMemberState);
	}
});

//Member Join Server
Fishsticks.on('guildMemberAdd', newMember => {
	log('info', `[CLIENT] ${newMember.nickname} joined the server.`);
	handleNewJoin(Fishsticks, newMember);
});

//Member Leave Server
Fishsticks.on('guildMemberRemove', prevMember => {
	log('info', `[CLIENT] ${prevMember.nickname} departed the server.`);
	handleOldMember(Fishsticks, prevMember);
});

//Receive Message Reaction
Fishsticks.on('messageReactionAdd', (addedReaction, reactor) => {
	log('info', `[CLIENT] ${addedReaction.emoji} : ${reactor.username}`);

	validateReaction(Fishsticks, addedReaction, reactor);
});

//Remove Message Reaction
Fishsticks.on('messageReactionRemove', (removedReaction, reactor) => {
	log('info', `[CLIENT] ${removedReaction.emoji} : ${reactor.username}`);
});

//Utility

//Schedule Crons
schedule.scheduleJob('8 * * *', function() {
	doDailyPost(Fishsticks);
});

//==============================================
// Login

Fishsticks.login(token);