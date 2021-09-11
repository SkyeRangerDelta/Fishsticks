// ---- FSO Driver ----

//Imports
const { MongoClient } = require('mongodb');

const { fsoValidationException } = require('../Errors/fsoValidationException');
const { log } = require('../Utility/Utils_Log');

const { uri } = require('./FSO_assets.json');

//Exports
module.exports = {
	fso_connect,
	fso_status,
	fso_query,
	fso_verify
};

//Functions

const client = new MongoClient(uri);

async function fso_connect() {
	log('info', '[FSO] Pending Connection...');

	//Return conduit
	return await client.connect();
}

async function fso_status(connection) {
	log('info', '[FSO] Querying FSO Status...');

	const query = { id: 1 };
	const database = connection.db('FishsticksOnline');
	const currentStatus = await database.collection('FSO_Status').findOne(query);

	if (currentStatus.Online) {
		log('proc', '[FSO] Reporting ONLINE.');
		return 'ONLINE';
	}
	else {
		log ('warn', '[FSO] Reporting OFFLINE.');
		return 'OFFLINE';
	}
}

async function fso_query(connection, table, key, value, filter) {
	log('info', '[FSO] Dispatching a query');

	const filterDoc = { id: 1 };
	const updateDoc = {
		$inc: {
			Queries: 1
		}
	};

	const database = connection.db('FishsticksOnline');
	await database.collection('FSO_Status').updateOne(filterDoc, updateDoc);

	switch (key) {
		case 'select':
			return database.collection(table).findOne(value);
		case 'selectAll':
			return await database.collection(table).find({}).toArray();
		case 'update':
			return database.collection(table).updateOne(filter, value);
		case 'replace':
			return await database.collection(table).replaceOne(filter, value);
		case 'insert':
			return database.collection(table).insertOne(value);
		case 'filter':
			return database.collection(table).find(value);
		case 'table':
			return database.collection(table);
		case 'delete':
			return await database.collection(table).deleteOne(value);
		case 'deleteMany':
			return await database.collection(table).deleteMany(value);
		default:
			throw 'Invalid FSO Query!';
	}
}

async function fso_verify(connection) {
	log('info', '[FSO] Verification routine...');
}