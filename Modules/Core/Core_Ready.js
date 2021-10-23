// ---- Boot Routine ----

//Imports
const { fsProcessException } = require('../Errors/fsProcessException');

const { log } = require('../Utility/Utils_Log');

const { fso_connect, fso_status, fso_query, fso_verify } = require('../FSO/FSO_Utils');
const { convertMsFull, systemTimestamp } = require('../Utility/Utils_Time');
const { embedBuilder } = require('../Utility/Utils_EmbedBuilder');

const { guild_CCG, fs_console, ranger } = require('./Core_ids.json');
const { version } = require('../../package.json');
const { terminate } = require('../Utility/Utils_Aux');
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
			if (process.argv[arg] === '-test') {
				Fishsticks.TESTMODE = true;
			}

			Fishsticks.NODEARGS.push(process.argv[arg]);
		}
	}

	//Variables
	const timestamp = new Date();
	const timeNow = Date.now();

	//Init Objs
	Fishsticks.CCG = await Fishsticks.guilds.fetch(guild_CCG);
	Fishsticks.CONSOLE = await Fishsticks.channels.cache.get(fs_console);
	Fishsticks.RANGER = await Fishsticks.CCG.members.fetch(ranger);

	//Console confirmation
	log('proc', '[CLIENT] Fishsticks is out of the oven.\n-------------------------------------------------------');

	// -- Perform startup routine --
	//FSO Connection
	try {
		Fishsticks.FSO_CONNECTION = await fso_connect();

		//Before FSO syncs begin - conduct a DB validation
		/*
		try {
			Fishsticks.FSO_VALID = await fso_verify(Fishsticks.FSO_CONNECTION);
		}
		catch (e) {
			throw new fsProcessException('FSO validation could not be completed.\n' + e);
		}
		finally {
			Fishsticks.FSO_STATE = await fso_status(Fishsticks.FSO_CONNECTION);
		}
		*/
	}
	catch (error) {
		if (error.name === 'MongoServerSelectionError') {
			log('err', '[FSO] [FATAL] FSO could not be reached!.\n' + error);
			await Fishsticks.CONSOLE.send(`${Fishsticks.RANGER}, FSO connection failed, check the server and subroutine config.`);
			return terminate(Fishsticks);
		}
		else {
			log('err', '[FSO] Something has gone wrong in the startup routine.\n' + error);
		}
	}

	//Sync FSO Status
	const statusPreUpdate = await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_Status', 'select', { id: 1 });

	Fishsticks.session = ++statusPreUpdate.Session;
	Fishsticks.lastSystemStart = convertMsFull(statusPreUpdate.StartupTime - timeNow);

	const filterDoc = {
		id: 1
	};
	const statusTableUpdate = {
		$set: {
			Online: true,
			Session: Fishsticks.session,
			StartupTime: systemTimestamp(),
			StartupUTC: timeNow
		}
	};

	const statusPostUpdate = await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', statusTableUpdate, filterDoc);

	if (statusPostUpdate.modifiedCount !== 1) {
		log('warn', '[FSO] Status table update failed. Record update count was not expected.');
	}
	else {
		log ('info', '[FSO] Status table update done.');
	}


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
					name: 'Last startup time',
					value: statusPreUpdate.StartupTime,
					inline: true
				}
			]
		};

		Fishsticks.CONSOLE.send({ embeds: [embedBuilder(startupMessage)] });

		//Set Status
		await Fishsticks.user.setPresence({
			activities: [{ name: version + ' | TEST MODE', type: 'PLAYING' }],
			status: 'online'
		});
	}
	else {
		const startupMessage = {
			title: 'o0o - Fishsticks Startup - o0o',
			description: 'Dipping in flour...\nBaking at 400°...\nFishticks ' + version + ' is ready to go!',
			color: primary,
			footer: 'Sequence initiated at ' + systemTimestamp(timestamp),
			fields: [
				{
					name: 'Last startup time',
					value: statusPreUpdate.StartupTime,
					inline: true
				},
				{
					name: 'Time since last startup',
					value: convertMsFull(statusPreUpdate.StartupUTC - timeNow),
					inline: true
				}
			]
		};

		const startupEmbed = embedBuilder(startupMessage);
		Fishsticks.CONSOLE.send({ embeds: [startupEmbed] });

		//Set Status
		await Fishsticks.user.setPresence({
			activities: [{ name: 'for !help | ' + version, type: 'WATCHING' }],
			status: 'online'
		});
	}

	//Startup Complete
	log('proc', '[CLIENT] Fishsticks is ready to run.\n-------------------------------------------------------');

}