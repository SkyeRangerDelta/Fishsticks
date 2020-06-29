// ---- FSO Driver ----

//Imports
const Rethink = require('rethinkdb');
const { log } = require('../Utility/Utils_Log');
const { host, port, user, pass, db } = require('./FSO_assets.json');

//Exports
module.exports = {
	fso_connect,
	fso_status,
	fso_query
};

//Functions
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

	switch (key) {
		case 'select':
			return await Rethink.table(table).get(value).run(connection);
		case 'update':
			return await Rethink.table(table).update(value).run(connection);
		case 'insert':
			return await Rethink.table(table).insert(value).run(connection);
		case 'filter':
			return await Rethink.table(table).filter(value).run(connection);
		default:
			throw 'Invalid FSO Query!';
	}
}