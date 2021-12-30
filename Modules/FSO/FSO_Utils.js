// ---- FSO Driver ----

//Imports
const { MongoClient } = require('mongodb');

//const { fsoValidationException } = require('../Errors/fsoValidationException');
const { log } = require('../Utility/Utils_Log');
const { terminate } = require('../Utility/Utils_Terminate');

const { fsoValidationException } = require('../Errors/fsoValidationException');

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
	let database;

	try {
		database = connection.db('FishsticksOnline');
	}
	catch (fsoErr) {
		log('err', '[FSO] FSO conduit is invalid! Connection aborted!');
		await terminate();
	}

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

async function fso_query(connection, coll, key, value, filter, aFilter) {
	log('info', '[FSO] Dispatching a query');

	const filterDoc = { id: 1 };
	const updateDoc = {
		$inc: {
			Queries: 1
		}
	};

	let database;

	try {
		database = connection.db('FishsticksOnline');
	}
	catch (fsoErr) {
		log('err', '[FSO] FSO conduit is invalid! Connection aborted!');
		await terminate();
	}

	await database.collection('FSO_Status').updateOne(filterDoc, updateDoc);

	switch (key) {
		case 'select':
			return database.collection(coll).findOne(value);
		case 'selectAll':
			return await database.collection(coll).find({}).toArray();
		case 'update':
			return await database.collection(coll).updateOne(filter, value);
		case 'arrUpdate':
			return await database.collection(coll).updateOne(filter, value, aFilter);
		case 'findAndMod':
			return await database.collection(coll).findOneAndUpdate(filter, value);
		case 'replace':
			return await database.collection(coll).replaceOne(filter, value);
		case 'insert':
			return database.collection(coll).insertOne(value);
		case 'insertMany':
			return database.collection(coll).insertMany(value);
		case 'table':
			return database.collection(coll);
		case 'delete':
			return await database.collection(coll).deleteOne(value);
		case 'deleteMany':
			return await database.collection(coll).deleteMany(value);
		case 'count':
			return await database.collection(coll).count();
		default:
			throw new fsoValidationException('Invalid FSO Query!');
	}
}

async function fso_verify(connection) {
	log('info', '[FSO] Verification routine...');
}