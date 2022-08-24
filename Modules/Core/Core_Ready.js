// ---- Boot Routine ----

//Imports
const { log } = require('../Utility/Utils_Log');

const { fso_connect, fso_query } = require('../FSO/FSO_Utils');
const { convertMsFull, systemTimestamp } = require('../Utility/Utils_Time');
const { embedBuilder } = require('../Utility/Utils_EmbedBuilder');
const { terminate } = require('../Utility/Utils_Terminate');

const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const { guild_CCG, fs_console, fsID, bLogger, ranger } = require('./Core_ids.json');
const { version } = require('../../package.json');
const { primary, emergency } = require('./Core_config.json').colors;
const { token } = require('./Core_config.json');

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
	Fishsticks.BOT_LOG = await Fishsticks.channels.cache.get(bLogger);
	Fishsticks.RANGER = await Fishsticks.CCG.members.fetch(ranger);
	Fishsticks.MEMBER = await Fishsticks.CCG.members.fetch(fsID);

	//Cache all members for ROLE-SYS checks
	Fishsticks.CCG.members.fetch();

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
	Fishsticks.DOCKET_PIN = statusPreUpdate.docketPinID || 0;

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

	// Register slash commands
	const commandObjs = [];
	const globalCmdObjs = [];
	const cmdPath = path.join(__dirname, '../..', 'Commands/Active');
	const commandData = fs.readdirSync(cmdPath).filter(f => f.endsWith('.js'));

	for (const cmdFile of commandData) {
		const cmd = require(`../../Commands/Active/${cmdFile}`);

		//Register commands separately.
		if (cmd.global) {
			globalCmdObjs.push(cmd.data.toJSON());
		}
		else {
			commandObjs.push(cmd.data.toJSON());
		}

		Fishsticks.CMDS.set(cmd.data.name, cmd);
	}

	log('proc', '[CMD-HANDLER] Beginning command registration');
	const rest = new REST({ version: 9 }).setToken(token);
	try {

		log('proc', '[CMD-HANDLER] Doing global registration...');
		await rest.put(
			Routes.applicationCommands(
				`${fsID}`
			),
			{ body: globalCmdObjs }
		);

		log('proc', '[CMD-HANDLER] Doing guild registration');
		await rest.put(
			Routes.applicationGuildCommands(
				`${fsID}`,
				`${guild_CCG}`
			),
			{ body: commandObjs }
		);

		log('proc', '[CMD-HANDLER] Finished registering commands');
	}
	catch (e) {
		console.log(e);
		log('err', '[CMD-HANDLER] Failed to finished registering commands!');
		Fishsticks.destroy();
		process.exit(1);
	}

	//Cache data
	// - Poll messages
	try {
		const polls = await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_Polls', 'selectAll');
		for (const poll in polls) {
			const ch = await Fishsticks.channels.cache.get(polls[poll].chId);
			await ch.messages.fetch(polls[poll].intId);
			Fishsticks.pollCache++;
		}
	}
	finally {
		log('proc', `[POLL] Cached all ${Fishsticks.pollCache} polls successfully.`);
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