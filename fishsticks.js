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
const { Client, GatewayIntentBits } = require( 'discord.js' );
const schedule = require( 'node-schedule' );
const fs = require( 'fs' );
const { config } = require( 'dotenv' );

//Configs
config();
const token = process.env.TOKEN;

//Modules
const { doDailyPost } = require( './Modules/Utility/Utils_Aux' );


//=============================================
//				  GLOBALS
//=============================================

//Client
const Fishsticks = new Client( {
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.MessageContent
	],
	allowedMentions: {
		parse: [
			'users',
			'roles'
		]
	}
} );

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
Fishsticks.DOCKET_PIN = null;
Fishsticks.ENTITIES = {
	Users: {},
	Roles: {},
	Channels: {},
	Categories: {},
	Guilds: {},
};
Fishsticks.ENTITIES.CCG = '';
Fishsticks.CCG = {};
Fishsticks.CONFIG = {};
Fishsticks.GIT_INSTALL_TOKEN = '';
Fishsticks.GIT_INSTALL_TOKEN_GEN_TIME = null;

//=============================================
//				EVENTS INDEX
//=============================================
const eventsIndex = fs.readdirSync( './Events' ).filter( f => f.endsWith( '.js' ) );

for ( const eventFile in eventsIndex ) {
	const event = require( `./Events/${eventsIndex[eventFile]}` );
	if ( event.once ) {
		Fishsticks.once( event.name, ( ...args ) => event.execute( Fishsticks, ...args ) );
	}
	else {
		Fishsticks.on( event.name, ( ...args ) => event.execute( Fishsticks, ...args ) );
	}
}

//=============================================
//				   UTILITY
//=============================================

//Schedule Crons
const dailyRule = new schedule.RecurrenceRule();
dailyRule.hour = 8;
dailyRule.minute = 0;
dailyRule.tz = 'America/New_York';
schedule.scheduleJob( dailyRule, async function() {
	await doDailyPost( Fishsticks );
} );

process.on( 'unhandledRejection', e => {
	console.log( '[ERR] ' + e );
} );

//==============================================
// Login

Fishsticks.login( token ).then( () => {
	console.log( 'Fishsticks is logged in!' );
} );