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

//Modules
const { startUp } = require('./Modules/Core/Core_Ready');
const { log } = require('./Modules/Utility/Utils_Log');
const { processMessage } = require('./Modules/Core/Core_Message');
const { validateReaction } = require('./Modules/Utility/Utils_Aux');

//Configs
const { token } = require('./Modules/Core/Core_config.json');

//=============================================
//				  GLOBALS
//=============================================

//Client
const Fishsticks = new Discord.Client();

//Client Variables
Fishsticks.FSO_CONNECTION = null;
Fishsticks.FSO_STATE = null;
Fishsticks.session;
Fishsticks.lastSystemStart;
Fishsticks.CCG;
Fishsticks.RANGER;
Fishsticks.appMsgIDs = [];
Fishsticks.debMsgIDs = [];
Fishsticks.TESTMODE = false;
Fishsticks.NODEARGS = [];

//=============================================
//				   EVENTS
//=============================================

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
	if (msg.author == Fishsticks.user) return;
	if (msg.author.bot) return;

	processMessage(Fishsticks, msg);
});

//Voice Channel Change
Fishsticks.on('voiceStateUpdate', (prevMemberState, newMemberState) => {
	log('info', `[CLIENT] ${prevMemberState.id} : ${newMemberState.id}`);
});

//Member Join Server
Fishsticks.on('guildMemberAdd', newMember => {
	log('info', `[CLIENT] ${newMember.nickname}`);
});

//Member Leave Server
Fishsticks.on('guildMemberRemove', prevMember => {
	log('info', `[CLIENT] ${prevMember.nickname}`);
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


//==============================================
// Login

Fishsticks.login(token);