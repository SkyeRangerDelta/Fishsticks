//----DOCKET----
//Add, edit, delete points for meetings

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { log } = require('../../Modules/Utility/Utils_Log');
const { systemTimestamp } = require('../../Modules/Utility/Utils_Time');
const { council } = require('../../Modules/Core/Core_ids.json');

//Exports
module.exports = {
	run,
	help
};

//Globals
let flags = [];
let pointDesc = null;
let pointNum = null;

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });
	const params = cmd.content;

	console.log(params);

	//!docket
	//!docket -[func] -<flags> -[point/number]

	if (params[0] === 'a' || params[0] === 'add') {
		validateParams('add', params, cmd);

		log('info', '[DOCKET] Adding a point.');
		addPoint(fishsticks, cmd);
	}
	else if (params[0] === 'e' || params[0] === 'edit') {
		validateParams('edit', params, cmd);

		log('info', '[DOCKET] Editing a point.');
		editPoint(fishsticks, cmd);
	}
	else if (params[0] === 'd' || params[0] === 'delete') {
		validateParams('delete', params, cmd);

		log('info', '[DOCKET] Deleting a point.');
		deletePoint(fishsticks, cmd);
	}
	else if (params[0] === 's' || params[0] === 'sticky') {
		validateParams('toggle', params, cmd);

		log('info', '[DOCKET] Setting a point to sticky.');
		toggleStickyPoint(fishsticks, cmd);
	}
	else if (params[0] === 'c' || params[0] === 'closed') {
		validateParams('toggle', params, cmd);

		log('info', '[DOCKET] Setting a point to closed.');
		toggleClosedPoint(fishsticks, cmd);
	}
	else if (params[0] === 'clear') {
		log('info', '[DOCKET] Clearing the docket.');
		clearDocket(fishsticks, cmd);
	}
	else {
		log('info', '[DOCKET] Listing points.');
		listPoints(fishsticks, cmd);
	}
}

//Add
async function addPoint(fishsticks, cmd) {
	//!docket -[a | add] -<sc> -[point]

	//Object
	const newDocketPoint = {
		author: cmd.msg.member.displayName,
		pointDesc: pointDesc,
		sticky: false,
		closed: false,
		timestamp: systemTimestamp(),
		pointID: genPointID()
	};

	//Set flags
	for (const flag in flags) {
		if (flags[flag] === 's') {
			log('info', '[DOCKET] New point is sticky.');
			newDocketPoint.sticky = true;
		}
		else if (flags[flag] === 'c') {
			log('info', '[DOCKET] New point is closed.');
			newDocketPoint.closed = true;
		}
	}

	//Add the point and verify
	const docketAddResponse = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'insert', newDocketPoint);

	if (docketAddResponse.inserted === 1) {
		cmd.msg.reply('Docket point added!').then(sent => sent.delete({ timeout: 10000 }));
	}
	else {
		throw 'Mmmmm, adding that had some unexpected repurcussions. Might wanna check on that.' + fishsticks.RANGER;
	}

	//Clear global
	flags = [];
}

//Edit
async function editPoint(fishsticks, cmd) {
	//!docket -[e | edit] -[pointNum] -[newPoint]

	//Try to collect point in question
	const editVerify = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'filter', { pointID: pointNum });
	const editVerifyArr = await editVerify.toArray();

	//Validate
	if (!editVerify || editVerifyArr.length === 0) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}

	//Create update object
	const editedPoint = {
		pointDesc: pointDesc,
		timestamp: systemTimestamp(),
		pointID: pointNum,
		id: null
	};

	//Validate point ID
	if (editVerifyArr[0].pointID !== pointNum) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}

	//Try update
	editedPoint.id = editVerifyArr[0].id;
	const editDispatch = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'update', editedPoint);

	//Check response
	if (editDispatch.replaced === 1) {
		return cmd.msg.reply('Point updated!').then(sent => sent.delete({ timeout: 10000 }));
	}
	else {
		throw 'Not sure what happened in here but something likely needs to be looked at. Someone ping Delta.';
	}

}

//Delete
async function deletePoint(fishsticks, cmd) {
	//!docket -[d | delete] -[pointNum]

	//Try to collect point in question
	const editVerify = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'filter', { pointID: pointNum });
	const editVerifyArr = await editVerify.toArray();

	//Validate
	if (!editVerify || editVerifyArr.length === 0) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}
	else if (editVerifyArr[0].pointID !== pointNum) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}

	//Do delete
	const delDispatch = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'delete', editVerifyArr[0].id);

	//Verify
	if (delDispatch.deleted !== 1) {
		throw 'Deletion error!';
	}
	else {
		return cmd.msg.reply('Point deleted!').then(sent => sent.delete({ timeout: 10000 }));
	}

}

//Toggle Sticky
async function toggleStickyPoint(fishsticks, cmd) {
	//Try to collect point in question
	const editVerify = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'filter', { pointID: pointNum });
	const editVerifyArr = await editVerify.toArray();

	//Validate
	if (!editVerify || editVerifyArr.length === 0) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}
	else if (editVerifyArr[0].pointID !== pointNum) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}

	//Do toggle
	const newObj = {
		id: editVerifyArr[0].id,
		sticky: !editVerifyArr[0].sticky
	};

	const toggleRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'update', newObj);

	//Verify
	if (toggleRes.replaced !== 1) {
		throw 'Update error!';
	}
	else {
		return cmd.msg.reply('Sticky toggled!').then(sent => sent.delete({ timeout: 10000 }));
	}
}

//Toggle Closed
async function toggleClosedPoint(fishsticks, cmd) {
	//Try to collect point in question
	const editVerify = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'filter', { pointID: pointNum });
	const editVerifyArr = await editVerify.toArray();

	//Validate
	if (!editVerify || editVerifyArr.length === 0) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}
	else if (editVerifyArr[0].pointID !== pointNum) {
		return cmd.msg.reply('Couldnt find that docket point. Check the listings to make sure its there?').then(sent => sent.delete({ timeout: 10000 }));
	}

	//Do toggle
	const newObj = {
		id: editVerifyArr[0].id,
		closed: !editVerifyArr[0].closed
	};

	const toggleRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'update', newObj);

	//Verify
	if (toggleRes.replaced !== 1) {
		throw 'Update error!';
	}
	else {
		return cmd.msg.reply('Closed toggled!').then(sent => sent.delete({ timeout: 10000 }));
	}
}

//Clear
async function clearDocket(fishsticks, cmd) {
	const docketListing = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'selectAll');

	let pointListing = null;

	if (!docketListing) {
		log('info', '[DOCKET] No points found.');
		return cmd.msg.reply('Docket is already clear!').then(sent => sent.delete({ timeout: 10000 }));
	}
	else {
		pointListing = await docketListing.toArray();
	}

	for (const point in pointListing) {
		if (!pointListing[point].sticky) {
			log('info', '[DOCKET] Attempting to delete pointID: ' + pointListing[point].pointID);
			const delRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'deleteAlt', { pointID: pointListing[point].pointID });

			if (delRes.deleted !== 1) {
				return cmd.msg.reply('Clearing halted - point deletion attempt failed.');
			}
		}
	}

	return cmd.msg.reply('Docket cleared!').then(sent => sent.delete({ timeout: 10000 }));
}

//List
async function listPoints(fishsticks, cmd) {
	const docketListing = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Docket', 'selectAll');

	let pointListing = null;

	//Check empty
	if (!docketListing) {
		log('info', '[DOCKET] No points found.');
		pointListing = 'Looks pretty empty in here. Perhaps you should add something.';
	}
	else {
		pointListing = await docketListing.toArray();
	}

	const listEmbed = {
		title: 'o0o - Docket - o0o',
		description: 'A listing of all the current docket points.',
		footer: `Latest pull from FSO by ${cmd.msg.member.displayName}.`,
		fields: []
	};

	//Process fields
	//If council
	if (cmd.msg.channel.id === council) {
		for (const point in pointListing) {
			listEmbed.fields.push({
				title: getTitle(pointListing[point]),
				description: pointListing[point].pointDesc,
				inline: false
			});
		}
	}
	else { //Not council
		for (const point in pointListing) {
			if (!pointListing[point].closed) {
				listEmbed.fields.push({
					title: getTitle(pointListing[point]),
					description: pointListing[point].pointDesc,
					inline: false
				});
			}
		}
	}

	await cmd.msg.channel.send({embed: embedBuilder(listEmbed)});
}

function help() {
	return 'Add, edit, or delete points for community meetings.';
}

function validateParams(mode, params, cmd) {
	//Validate flags

	//If adding a point...
	if (mode === 'add') {

		if (!params[1]) {
			throw 'Looks like something was missing here boss. Check the docs?';
		}

		switch (params[1]) {
			case 's':
				flags.push('s');
				pointDesc = params[2];
				break;
			case 'c':
				flags.push('c');
				pointDesc = params[2];
				break;
			case 'sc':
				flags.push('c');
				flags.push('s');
				pointDesc = params[2];
				break;
			case 'cs':
				flags.push('c');
				flags.push('s');
				pointDesc = params[2];
				break;
			default: //Assume no flags
				pointDesc = params[1];
		}
	}
	else if (mode === 'edit') {
		//If editing a point
		if (isNaN(params[1])) { //Check if not a number for second param
			return cmd.msg.reply('I cant edit a nonexistent point!').then(sent => sent.delete({ timeout: 10000 }));
		}

		if (!params[2]) { //If no edit was found
			throw 'There was no edit to be made!';
		}

		pointDesc = params[2];
		pointNum = parseInt(params[1]);
	}
	else if (mode === 'delete' || mode === 'toggle') {
		//If deleting a point
		if (isNaN(params[1])) {
			return cmd.msg.reply('The point number must be a number!').then(sent => sent.delete({ timeout: 10000 }));
		}
		else if(!params[1]) {
			return cmd.msg.reply('Theres a disconnect here. Like, you didnt even throw me a bone on this one. Give me a point number.').then(sent => sent.delete({ timeout: 10000 }));
		}

		pointNum = parseInt(params[1]);
	}
	else {
		throw 'Invalid parameter mode state.';
	}
}

function getTitle(docketPoint) {
	let pointTitle = `[${docketPoint.pointID}] `;

	if (docketPoint.sticky) {
		pointTitle = pointTitle.concat('📌');
	}

	if (docketPoint.closed) {
		pointTitle = pointTitle.concat('🔒');
	}

	pointTitle = pointTitle.concat(docketPoint.author) + ` (${docketPoint.timestamp})`;

	return pointTitle;
}

function genPointID() {
	return Math.floor(Math.random() * (999 - 100) + 100);
}