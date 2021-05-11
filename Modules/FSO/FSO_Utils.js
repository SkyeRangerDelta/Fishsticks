// ---- FSO Driver ----

//Imports
const Rethink = require('rethinkdb');

const { fsoValidationException } = require('../Errors/fsoValidationException');
const { log } = require('../Utility/Utils_Log');
const { systemTimestamp } = require('../Utility/Utils_Time');

const { host, port, user, pass, db } = require('./FSO_assets.json');

//Exports
module.exports = {
	fso_connect,
	fso_status,
	fso_query,
	fso_verify
};

async function fso_connect() {
	log('info', '[FSO] Pending Connection...');

	let FSO_CONNECTION;

	await Rethink.connect({
		host: host,
		port: port,
		db: db,
		user: user,
		password: pass
	}).then(conn => {
		log('info', '[FSO] Connection opened.');
		FSO_CONNECTION = conn;
	}).error(error => {
		throw 'FSO Connection Failure.\n' + error;
	});

	return FSO_CONNECTION;
}

async function fso_status(connection) {
	log('info', '[FSO] Querying FSO Status...');

	const currentStatus = await Rethink.table('Fs_Status').get(1).run(connection);

	if (currentStatus.Online) {
		log('proc', '[FSO] Reporting ONLINE.');
		return 'ONLINE';
	}
	else {
		log ('warn', '[FSO] Reporting OFFLINE.');
		return 'OFFLINE';
	}
}

async function fso_query(connection, table, key, value) {
	log('info', '[FSO] Dispatching a query');

	const currentStatus = await Rethink.table('Fs_Status').get(1).run(connection);
	await Rethink.table('Fs_Status').update({ id: 1, Queries: ++currentStatus.Queries }).run(connection);

	let docs = [];

	switch (key) {
		case 'select':
			return await Rethink.table(table).get(value).run(connection);
		case 'selectAll':
			return await Rethink.table(table).run(connection);
		case 'update':
			return await Rethink.table(table).get(value.id).update(value).run(connection);
		case 'replace':
			return await Rethink.table(table).get(value.id).replace(value.content).run(connection);
		case 'insert':
			return await Rethink.table(table).insert(value).run(connection);
		case 'filter':
			return await Rethink.table(table).filter(value).run(connection);
		case 'table':
			return await Rethink.table(table).run(connection);
		case 'tableSmall':
			await Rethink.table(table).run(connection, function(err, stream) {
				if (err) throw err;
				stream.toArray().then(arr => {docs = arr;});
			});

			return docs;
		case 'delete':
			return await Rethink.table(table).get(value).delete().run(connection);
		case 'deleteAlt':
			return await Rethink.table(table).filter(value).delete().run(connection);
		default:
			throw 'Invalid FSO Query!';
	}
}

async function fso_verify(connection) {
	log('info', '[FSO] Conducting a DB validity check...');
	const tableList = await Rethink.tableList().run(connection);
	let validCount = 0;

	//Validate table count
	if (await verify_tableLength(connection, tableList) === 1) {
		log('info', '[FSO] DB integrity check passed.');
		validCount++;
	}

	//Validate table naming schema
	if (await verify_tableNameSchema(connection, tableList) === 1) {
		log('info', '[FSO] Table name schema check passed.');
		validCount++;
	}

	//Validate required table records
	if (await verify_statusTableInit(connection) === 1) {
		log('info', '[FSO] Status record check passed.');
		validCount++;
	}

	if (validCount === 3) {
		return 'True';
	}
	else {
		throw new fsoValidationException('FSO verification failed for unknown reasons.');
	}
}

async function verify_tableLength(connection, tableList) {
	if (tableList.length !== 6) {
		throw new fsoValidationException('Improper table count.');
	}

	return 1;
}

async function verify_tableNameSchema(connection, tableList) {
	const tablePrefix = 'Fs_';
	const tables = ['Docket', 'MemberStats', 'Polls', 'Roles', 'Status', 'TempCh'];

	for (const tableInd in tables) {
		if (!tableList.includes(tablePrefix + tables[tableInd])) {
			log('info', `[FSO] ${tablePrefix + tables[tableInd]} missing!`);
			await Rethink.tableCreate(tablePrefix + tables[tableInd]).run(connection).then(res => {
				if (res.tables_created === 1) {
					log('info', `[FSO] ${tablePrefix + tables[tableInd]} created successfully.`);
				}
				else {
					throw new fsoValidationException('FSO table creation failed whilst creating table ' + tablePrefix + tables[tableInd]);
				}
			});
		}
	}

	return 1;
}

async function verify_statusTableInit(connection) {
	log('info', '[FSO] Looking for a status record...');

	const statusRecordRes = await Rethink.table('Fs_Status').get(1).run(connection);

	if (!statusRecordRes) {
		const statusInit = {
			id: 1,
			Online: true,
			Session: 2720,
			StartupTime: systemTimestamp(),
			StartupUTC: Date.now(),
			Queries: 0
		};


		const insertRes = await Rethink.table('Fs_Status').insert(statusInit).run(connection);

		if (!insertRes || insertRes.inserted !== 1) {
			throw new fsoValidationException('Status INIT record failed to create.');
		}
	}

	return 1;
}