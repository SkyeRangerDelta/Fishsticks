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
Fishsticks.CMDS = new Map();
Fishsticks.session;
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
//Schedule Crons
schedule.scheduleJob('8 * * *', function() {
	doDailyPost(Fishsticks);
});

process.on('unhandledRejection', e => {
	console.log('[WARN] ' + e);
});

//==============================================
// Login

Fishsticks.login(token);