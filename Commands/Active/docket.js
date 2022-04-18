//----DOCKET----
//Add, edit, delete points for meetings

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { log } = require('../../Modules/Utility/Utils_Log');
const { systemTimestamp } = require('../../Modules/Utility/Utils_Time');
const { council } = require('../../Modules/Core/Core_ids.json');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { SlashCommandBuilder } = require('@discordjs/builders');

//TODO: Conduct tests on multi-option commands

//Data
const data = new SlashCommandBuilder()
	.setName('docket')
	.setDescription('Add, edit, list, and delete points for CC community meetings.');

data.addSubcommand(s => s
	.setName('add')
	.setDescription('Add a docket point.')
	.addStringOption(o => o.setName('docket-topic').setDescription('The topic content/stuff that should be discussed.').setRequired(true))
	.addBooleanOption(b => b.setName('sticky').setDescription('Is this a sticky (persistent) topic?').setRequired(false))
	.addBooleanOption(b => b.setName('closed').setDescription('Is this a closed (council only) topic?').setRequired(false))
);

data.addSubcommand(s => s
	.setName('delete')
	.setDescription('Delete a docket point.')
	.addIntegerOption(o => o.setName('point-id').setDescription('The ID of the docket point to delete.').setRequired(true))
);

data.addSubcommand(s => s
	.setName('edit')
	.setDescription('Edit a docket point.')
	.addIntegerOption(o => o.setName('point-id').setDescription('The ID of the docket point to edit.').setRequired(true))
	.addStringOption(o => o.setName('docket-topic').setDescription('Revised topic to assign to the docket point.').setRequired(true))
	.addBooleanOption(b => b.setName('sticky').setDescription('Convert this to a sticky (persistent) topic?').setRequired(false))
	.addBooleanOption(b => b.setName('closed').setDescription('Convert this to a closed (council only) topic?').setRequired(false))
);

data.addSubcommand(s => s
	.setName('toggle-sticky')
	.setDescription('Toggle a docket points sticky state.')
	.addIntegerOption(o => o.setName('point-id').setDescription('The ID of the docket point to toggle sticky for.').setRequired(true))
);

data.addSubcommand(s => s
	.setName('toggle-closed')
	.setDescription('Toggle a docket points closed state.')
	.addIntegerOption(o => o.setName('point-id').setDescription('The ID of the docket point to toggle closed for.').setRequired(true))
);

data.addSubcommand(s => s
	.setName('clear')
	.setDescription('Clear the docket (except stickies) of docket points.')
);

data.addSubcommand(s => s
	.setName('list')
	.setDescription('Displays the docket.')
);

//Add, edit, delete, toggle sticky, toggle closed, clear, list(?)

//Functions
async function run(fishsticks, int) {
	//TODO: Finish refactoring for slash commands

	console.log(int.options);
	const subCMD = int.options.getSubcommand();

	if (subCMD === 'add') {
		await addPoint(fishsticks, int);
	}
	else if (subCMD === 'delete') {
		await deletePoint(fishsticks, int);
	}
	else if (subCMD === 'edit') {
		await editPoint(fishsticks, int);
	}
	else if (subCMD === 'toggle-sticky') {
		await toggleStickyPoint(fishsticks, int);
	}
	else if (subCMD === 'toggle-closed') {
		await toggleClosedPoint(fishsticks, int);
	}
	else if (subCMD === 'clear') {
		await clearDocket(fishsticks, int);
	}
	else if (subCMD === 'list') {
		await listPoints(fishsticks, int);
	}
}

//Add
async function addPoint(fishsticks, int) {
	//docket add docket-topic sticky closed

	//Object
	const newDocketPoint = {
		author: int.member.displayName,
		pointDesc: int.options.getString('docket-topic'),
		sticky: int.options.getBoolean('sticky'),
		closed: int.options.getBoolean('closed'),
		timestamp: systemTimestamp(),
		pointID: genPointID()
	};

	//Add the point and verify
	const docketAddResponse = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'insert', newDocketPoint);

	if (docketAddResponse.acknowledged === true) {
		int.reply({ content: 'Docket point added!', ephemeral: true });
	}
	else {
		int.reply({ content: 'Mmmmm, adding that had some unexpected repercussions. Might wanna check on that. ' + fishsticks.RANGER, ephemeral: true });
	}
}

//Edit
async function editPoint(fishsticks, int) {
	//!docket edit point-id docket-topic sticky closed

	//Try to collect point in question
	const docketPt = await getDocketPointValidate(fishsticks, int);

	//Create update object
	const editedPoint = {
		$set: {
			pointDesc: int.options.getString('docket-topic'),
			sticky: int.options.getBoolean('sticky'),
			closed: int.options.getBoolean('closed'),
			timestamp: systemTimestamp(),
		}
	};

	//Try update
	const editDispatch = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'update', editedPoint, { pointID: docketPt.pointID });

	console.log(editDispatch);

	//Check response
	if (editDispatch.modifiedCount === 1) {
		return int.reply({ content: 'Point updated!', ephemeral: true });
	}
	else {
		return int.reply({ content: 'Not sure what happened in here but something likely needs to be looked at. Please ping Delta.', ephemeral: true });
	}

}

//Delete
async function deletePoint(fishsticks, int) {
	//!docket delete point-id

	//Try to collect point in question
	const docketPt = await getDocketPointValidate(fishsticks, int);

	//Do delete
	const delDispatch = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'delete', { pointID: docketPt.pointID });

	//Verify
	if (delDispatch.deletedCount !== 1) {
		throw 'Deletion error!';
	}
	else {
		return int.reply({ content: 'Point deleted!', ephemeral: true });
	}

}

//Toggle Sticky
async function toggleStickyPoint(fishsticks, int) {
	//Try to collect point in question
	const docketPoint = await getDocketPointValidate(fishsticks, int);

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
		return int.reply({ content: 'Sticky toggled!', ephemeral: true });
	}
}

//Toggle Closed
async function toggleClosedPoint(fishsticks, int) {
	//Try to collect point in question
	const docketPoint = await getDocketPointValidate(fishsticks, int);

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
		return int.reply({ content: 'Closed toggled!', ephemeral: true });
	}
}

//Clear
async function clearDocket(fishsticks, int) {
	if(!hasPerms(int.member, ['Moderator', 'Council Member', 'Council Advisor'])) {
		return int.reply({ content: 'You lack the permissions to clear the docket!', ephemeral: true });
	}

	const docketListing = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'selectAll');

	if (!docketListing) {
		log('info', '[DOCKET] No points found.');
		return int.reply({ content: 'Docket is already clear!', ephemeral: true });
	}

	for (const point in docketListing) {
		if (!docketListing[point].sticky) {
			log('info', '[DOCKET] Attempting to delete pointID: ' + docketListing[point].pointID);
			const delRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'delete', { pointID: docketListing[point].pointID });

			if (delRes.deletedCount !== 1) {
				return int.reply({ content: 'Clearing halted - point deletion attempt failed.', ephemeral: true });
			}
		}
	}

	return int.reply({ content: 'Docket cleared!', ephemeral: true });
}

//List
async function listPoints(fishsticks, int) {
	const docketListing = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'selectAll');

	let pointListing;

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
		footer: `Latest pull from FSO by ${int.member.displayName}.`,
		fields: []
	};

	//Process fields
	//If council
	if (int.channel.id === council) {
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

	await int.reply({ embeds: [embedBuilder(listEmbed)] });
}

function help() {
	return 'Add, edit, or delete points for community meetings.';
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

async function getDocketPointValidate(fishsticks, int) {
	const pointNum = int.options.getInteger('point-id');
	const dtPoint = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Docket', 'select', { pointID: pointNum });

	//Validate
	if (!dtPoint) {
		return int.reply({ content: 'Couldnt find that docket point. Check the listings to make sure its there?', ephemeral: true });
	}
	else if (dtPoint.pointID !== pointNum) {
		return int.reply({ content: 'Couldnt find that docket point. Check the listings to make sure its there?', ephemeral: true });
	}

	return dtPoint;
}

//Exports
module.exports = {
	name: 'docket',
	data,
	run,
	help
};