//----DOCKET----
//Add, edit, delete points for meetings

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { log } = require('../../Modules/Utility/Utils_Log');
const { systemTimestamp } = require('../../Modules/Utility/Utils_Time');
const { council } = require('../../Modules/Core/Core_ids.json');
const { hasPerms } = require('../../Modules/Utility/Utils_User');

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
		await addPoint(fishsticks, cmd);
	}
	else if (params[0] === 'e' || params[0] === 'edit') {
		validateParams('edit', params, cmd);

		log('info', '[DOCKET] Editing a point.');
		await editPoint(fishsticks, cmd);
	}
	else if (params[0] === 'd' || params[0] === 'delete') {
		validateParams('delete', params, cmd);

		log('info', '[DOCKET] Deleting a point.');
		await deletePoint(fishsticks, cmd);
	}
	else if (params[0] === 's' || params[0] === 'sticky') {
		validateParams('toggle', params, cmd);

		log('info', '[DOCKET] Setting a point to sticky.');
		await toggleStickyPoint(fishsticks, cmd);
	}
	else if (params[0] === 'c' || params[0] === 'closed') {
		validateParams('toggle', params, cmd);

		log('info', '[DOCKET] Setting a point to closed.');
		await toggleClosedPoint(fishsticks, cmd);
	}
	else if (params[0] === 'clear') {
		log('info', '[DOCKET] Clearing the docket.');
		await clearDocket(fishsticks, cmd);
	}
	else {
		log('info', '[DOCKET] Listing points.');
		await listPoints(fishsticks, cmd);
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
	const docketAddResponse = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'insert', newDocketPoint);

	if (docketAddResponse.acknowledged === true) {
		cmd.reply('Docket point added!', 10);
	}
	else {
		cmd.reply('Mmmmm, adding that had some unexpected repercussions. Might wanna check on that. ' + fishsticks.RANGER);
	}

	//Clear global
	flags = [];
}

//Edit
async function editPoint(fishsticks, cmd) {
	//!docket -[e | edit] -[pointNum] -[newPoint]

	//Try to collect point in question
	const docketPt = await getDocketPointValidate(fishsticks, cmd);

	//Create update object
	const editedPoint = {
		$set: {
			pointDesc: pointDesc,
			timestamp: systemTimestamp(),
		}
	};

	//Try update
	const editDispatch = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'update', editedPoint, { pointID: docketPt.pointID });

	console.log(editDispatch);

	//Check response
	if (editDispatch.modifiedCount === 1) {
		return cmd.reply('Point updated!', 10);
	}
	else {
		return cmd.reply('Not sure what happened in here but something likely needs to be looked at. Someone ping Delta.', 10);
	}

}

//Delete
async function deletePoint(fishsticks, cmd) {
	//!docket -[d | delete] -[pointNum]

	//Try to collect point in question
	const docketPt = await getDocketPointValidate(fishsticks, cmd);

	//Do delete
	const delDispatch = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'delete', { pointID: docketPt.pointID });

	//Verify
	if (delDispatch.deletedCount !== 1) {
		throw 'Deletion error!';
	}
	else {
		return cmd.reply('Point deleted!', 10);
	}

}

//Toggle Sticky
async function toggleStickyPoint(fishsticks, cmd) {
	//Try to collect point in question
	const docketPoint = await getDocketPointValidate(fishsticks, cmd);

	//Do toggle
	const newObj = {
		$set: {
			sticky: !docketPoint.sticky
		}
	};

	const toggleRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'update', newObj, { pointID: docketPoint.pointID });

	console.log(toggleRes);

	//Verify
	if (toggleRes.modifiedCount !== 1) {
		throw 'Update error!';
	}
	else {
		return cmd.reply('Sticky toggled!', 10);
	}
}

//Toggle Closed
async function toggleClosedPoint(fishsticks, cmd) {
	//Try to collect point in question
	const docketPoint = await getDocketPointValidate(fishsticks, cmd);

	//Do toggle
	const newObj = {
		$set: {
			closed: !docketPoint.closed
		}
	};

	const toggleRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'update', newObj, { pointID: docketPoint.pointID });

	//Verify
	if (toggleRes.modifiedCount !== 1) {
		throw 'Update error!';
	}
	else {
		return cmd.reply('Closed toggled!', 10);
	}
}

//Clear
async function clearDocket(fishsticks, cmd) {
	if(!hasPerms(cmd.message.member, ['Moderator', 'Council Member', 'Council Advisor'])) {
		return cmd.reply('You lack the permissions to clear the docket!', 10);
	}

	const docketListing = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'selectAll');

	if (!docketListing) {
		log('info', '[DOCKET] No points found.');
		return cmd.reply('Docket is already clear!', 10);
	}

	for (const point in docketListing) {
		if (!docketListing[point].sticky) {
			log('info', '[DOCKET] Attempting to delete pointID: ' + docketListing[point].pointID);
			const delRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'delete', { pointID: docketListing[point].pointID });

			if (delRes.deletedCount !== 1) {
				return cmd.reply('Clearing halted - point deletion attempt failed.');
			}
		}
	}

	return cmd.reply('Docket cleared!', 10);
}

//List
async function listPoints(fishsticks, cmd) {
	const docketListing = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'selectAll');

	let pointListing = null;

	//Check empty
	if (!docketListing) {
		log('info', '[DOCKET] No points found.');
		pointListing = 'Looks pretty empty in here. Perhaps you should add something.';
	}
	else {
		pointListing = await docketListing;
	}

	const listEmbed = {
		title: 'o0o - Docket - o0o',
		description: 'A listing of all the current docket points.',
		footer: `Latest pull from FSO by ${cmd.msg.member.displayName}.`,
		fields: []
	};

	//Process fields
	//If council
	if (cmd.channel.id === council) {
		for (const point in pointListing) {
			listEmbed.fields.push({
				name: getTitle(pointListing[point]),
				value: pointListing[point].pointDesc,
				inline: false
			});
		}
	}
	else { //Not council
		for (const point in pointListing) {
			if (!pointListing[point].closed) {
				listEmbed.fields.push({
					name: getTitle(pointListing[point]),
					value: pointListing[point].pointDesc,
					inline: false
				});
			}
		}
	}

	await cmd.channel.send({ embeds: [embedBuilder(listEmbed)] });
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
			return cmd.reply('I cant edit a nonexistent point!', 10);
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
			return cmd.reply('The point number must be a number!', 10);
		}
		else if(!params[1]) {
			return cmd.reply('Theres a disconnect here. Like, you didnt even throw me a bone on this one. Give me a point number.', 10);
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

async function getDocketPoint(fishsticks, cmd) {
	const editVerify = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'selectAll', { pointID: pointNum });

	//Validate
	if (!editVerify) {
		return cmd.reply('Couldnt find that docket point. Check the listings to make sure its there?', 10);
	}

	return editVerify;
}

async function getDocketPointValidate(fishsticks, cmd) {
	const dtPoint = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'select', { pointID: pointNum });

	//Validate
	if (!dtPoint) {
		return cmd.reply('Couldnt find that docket point. Check the listings to make sure its there?', 10);
	}
	else if (dtPoint.pointID !== pointNum) {
		return cmd.reply('Couldnt find that docket point. Check the listings to make sure its there?', 10);
	}

	return dtPoint;
}