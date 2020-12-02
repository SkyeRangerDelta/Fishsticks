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
