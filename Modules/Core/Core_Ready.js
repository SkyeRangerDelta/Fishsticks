// ---- Boot Routine ----

//Imports
const { log } = require('../Utility/Utils_Log');
const { fso_connect, fso_status, fso_query } = require('../FSO/FSO_Utils');
const { convertMsFull, systemTimestamp } = require('../Utility/Utils_Time');
const { embedBuilder } = require('../Utility/Utils_EmbedBuilder');

const { guild_CCG, fs_console, ranger } = require('./Core_ids.json');
const { version } = require('../../package.json');
const { primary, emergency } = require('./Core_config.json').colors;

//Exports
module.exports = {
	startUp
};

//Functions
async function startUp(Fishsticks) {

	//Test launch args
	if (process.argv.length > 2) {
		log('warn', '[FISHSTICKS] Fs was launched with at least one command line argument.');

		for (const arg in process.argv) {
			if (process.argv[arg] == '-test') {
				Fishsticks.TESTMODE = true;
			}

			Fishsticks.NODEARGS.push(process.argv[arg]);
		}
	}

	//Variables
	const timestamp = new Date();
	const timeNow = Date.now();

	//Console confirmation
	log('proc', '[CLIENT] Fishsticks is out of the oven.\n-------------------------------------------------------');

	// -- Perform startup routine --
	//FSO Connection
	try {
		Fishsticks.FSO_CONNECTION = await fso_connect();
		Fishsticks.FSO_STATE = await fso_status(Fishsticks.FSO_CONNECTION);
	}
	catch (error) {
		log('err', '[FSO] Something has gone wrong in the startup routine.\n' + error);
	}

	//Sync FSO Status
	const statusPreUpdate = await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_Status', 'select', 1);

	Fishsticks.session = ++statusPreUpdate.Session;
	Fishsticks.lastSystemStart = convertMsFull(statusPreUpdate.StartupTime - timeNow);

	const statusTableUpdate = {
		id: 1,
		Online: true,
		Session: Fishsticks.session,
		StartupTime: systemTimestamp(timestamp),
		StartupUTC: timeNow
	};

	const statusPostUpdate = await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_Status', 'update', statusTableUpdate);

	if (statusPostUpdate.replaced != 1) {
		log('warn', '[FSO] Status table update failed. Record update count was not expected.');
	}
	else {
		log ('info', '[FSO] Status table update done.');
	}

	//Init Objs
	const ch_fs_console = Fishsticks.channels.cache.get(fs_console);

	Fishsticks.CCG = await Fishsticks.guilds.fetch(guild_CCG);
	Fishsticks.RANGER = await Fishsticks.CCG.members.fetch(ranger);


	//Dispatch Startup Message
	if (Fishsticks.TESTMODE) {
		log('warn', '[FISHSTICKS] Fs has been booted into Test mode!');

		const startupMessage = {
			title: 'Test Mode Boot',
			description: version + ' feels undercooked. Test mode time.',
			color: emergency,
			footer: 'Sequence initiated at ' + systemTimestamp(timestamp),
			fields: [
				{
					title: 'Last startup time',
					description: statusPreUpdate.StartupTime,
					inline: true
				}
			]
		};

		ch_fs_console.send({ embed: embedBuilder(startupMessage) });

		//Set Status
		Fishsticks.user.setPresence({ activity: { name: version + ' | TEST MODE', type: 'PLAYING' }, status: 'online' });
	}
	else {
		const startupMessage = {
			title: 'o0o - Fishsticks Startup - o0o',
			description: 'Dipping in flour...\nBaking at 400°...\nFishticks ' + version + ' is ready to go!',
			color: primary,
			footer: 'Sequence initiated at ' + systemTimestamp(timestamp),
			fields: [
				{
					title: 'Last startup time',
					description: statusPreUpdate.StartupTime,
					inline: true
				},
				{
					title: 'Time since last startup',
					description: convertMsFull(statusPreUpdate.StartupUTC - timeNow),
					inline: true
				}
			]
		};

		ch_fs_console.send({ embed: embedBuilder(startupMessage) });

		//Set Status
		Fishsticks.user.setPresence({ activity: { name: 'for !help | ' + version, type: 'WATCHING' }, status: 'online' });
	}

	//Startup Complete
	log('proc', '[CLIENT] Fishsticks is ready to run.\n-------------------------------------------------------');

}