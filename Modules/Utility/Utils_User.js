// ---- User Utils ----
//======================
//Handles functions relating to permissions,
//info, statistics, etc.

//Imports
const { fso_query } = require('../FSO/FSO_Utils');
const { log } = require('../Utility/Utils_Log');
const { flexTime } = require('./Utils_Time');

//Exports
module.exports = {
	hasPerms,
	fso_validate,
	clearRecord
};

//Functions
function hasPerms(member, perms) {
	for (const perm in perms) {
		if (member.roles.cache.some(role => role.name === perms[perm])) {
			log('info', '[PERMS] User permission check passed.');
			return true;
		}
	}

	return false;
}

//Validate
//Return the member record, create one if necessary
async function fso_validate(Fishsticks, msg) {
	const memberCheck = await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: msg.author.id });

	if (memberCheck != null) {
		log('info', '[MEMBER-STATS] Member record located.');
		return memberCheck;
	}
	else {
		log('info', '[MEMBER-STATS] No member record located, attempting to create one.');

		let vouchState = 'Not Yet';

		if (hasPerms(msg.member, ['Recognized'])) {
			vouchState = 'Yes';
		}

		const memberRecord = {
			id: msg.author.id,
			username: msg.author.username,
			joinTime: msg.member.joinedAt,
			joinMs: msg.member.joinedTimestamp,
			joinTimeFriendly: await flexTime(new Date(msg.member.joinedTimestamp)),
			acAttempts: 0,
			acSuccess: 0,
			pcSuccess: 0,
			suggestionsPosted: 0,
			messagesSent: 0,
			lastMsg: msg.createdTimestamp,
			xp: {
				level: 1,
				RP: 0,
				goldfish: 0,
				spentGoldfish: 0
			},
			roles: [],
			vouches: [],
			vouchedIn: `${vouchState}`
		};


		const insertResponse = await insertNewMember(Fishsticks, memberRecord);
		if (insertResponse) {
			log('proc', '[MEMBER-STATS] New member record added successfully.');
			return await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: msg.author.id });
		}
		else {
			log('err', '[MEMBER-STATS] Record addition responded with an error.\n' + insertResponse);
		}
	}
}

async function insertNewMember(Fishsticks, recordToAdd) {
	const recordInsertionResponse = await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'insert', recordToAdd);

	if (recordInsertionResponse.inserted === 1) {
		return true;
	}
	else {
		return recordInsertionResponse;
	}
}

//Clear member record
async function clearRecord(Fishsticks, formerMember) {
	//Desc: clears the former members FSO roles, vouches, and stats

	const memberRecord = await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'delete', { id: formerMember.id });

	if (memberRecord.deletedCount !== 1) {
		log('err', '[RECORD-MAINT] Could not clear the record in question!');
	}
	else {
		log('proc', '[RECORD-MAINT] Departed member record cleared.');
	}
}