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
const fs = require('fs');

//Modules
const { doDailyPost } = require('./Modules/Utility/Utils_Aux');

//Configs
const { token, intents } = require('./Modules/Core/Core_config.json');


//=============================================
//				  GLOBALS
//=============================================

//Client
const Fishsticks = new Discord.Client({ intents: intents });

//Client Variables
Fishsticks.FSO_CONNECTION = null;
Fishsticks.FSO_STATE = null;
Fishsticks.FSO_VALID = null;
Fishsticks.session;
Fishsticks.lastSystemStart;
Fishsticks.CCG;
Fishsticks.RANGER;
Fishsticks.CONSOLE;
Fishsticks.pollCache = 0;
Fishsticks.appMsgIDs = [];
Fishsticks.debMsgIDs = [];
Fishsticks.TESTMODE = false;
Fishsticks.NODEARGS = [];
Fishsticks.SUMM_BRODEMODE = false;

//=============================================
//				EVENTS INDEX
//=============================================
const eventsIndex = fs.readdirSync('./Events').filter(f => f.endsWith('.js'));

for (const eventFile in eventsIndex) {
	const event = require(`./Events/${eventsIndex[eventFile]}`);
	if (event.once) {
		Fishsticks.once(event.name, (...args) => event.execute(Fishsticks, ...args));
	}
	else {
		Fishsticks.on(event.name, (...args) => event.execute(Fishsticks, ...args));
	}
}

//=============================================
//				   UTILITY
//=============================================
//==============================================
//applicationCommandUpdate**

//channelCreate

//channelDelete

//channelUpdate

//emojiCreate

//emojiDelete

//emojiUpdate

//guildBanAdd

//guildBanRemove

//guildMemberUpdate

//inviteCreate

//inviteDelete

//messageUpdate

//roleCreate

//roleDelete

//roleUpdate

//stageInstanceCreate

//stageInstanceDelete

//stageInstanceUpdate

//stickerCreate

//stickerDelete

//stickerUpdate

//threadCreate

//threadDelete

//webhookUpdate

//Schedule Crons
schedule.scheduleJob('8 * * *', function() {
	doDailyPost(Fishsticks);
});

//==============================================
// Login

Fishsticks.login(token);