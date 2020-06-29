// ---- User Utils ----
//======================
//Handles functions relating to permissions,
//info, statistics, etc.

//Imports
const { fso_query } = require('../FSO/FSO_Utils');
const { log } = require('../Utility/Utils_Log');

//Exports
module.exports = {
	hasPerms,
	fso_validate
};

//Functions
function hasPerms(member, perms) {
	for (const perm in perms) {
		if (perms[perm] == member.roles.cache.some(role => role.name === perm)) {
			return true;
		}
	}
}

//Validate
//Return the member record, create one if necessary
async function fso_validate(Fishsticks, msg) {
	const memberCheck = await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_MemberStats', 'select', msg.author.id);

	if (memberCheck != null) {
		log('info', '[MEMBER-STATS] Member record located.');
		return memberCheck;
	}
	else {
		log('info', '[MEMBER-STATS] No member record located, attempting to create one.');

		const memberRecord = {
			id: msg.author.id,
			username: msg.author.username,
			acAttempts: 0,
			acSuccess: 0,
			pcSuccess: 0,
			suggestionsPosted: 0,
			messagesSent: 0,
			xp: {
				level: 1,
				RP: 0,
				goldfish: 0,
				spentGoldfish: 0
			}
		};


		const insertResponse = await insertNewMember(Fishsticks, memberRecord);
		if (insertResponse) {
			log('proc', '[MEMBER-STATS] New member record added successfully.');
			return await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_MemberStats', 'select', msg.author.id);
		}
		else {
			log('err', '[MEMBER-STATS] Record addition responded with an error.\n' + insertResponse);
		}
	}
}

async function insertNewMember(Fishsticks, recordToAdd) {
	const recordInsertionResponse = await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_MemberStats', 'insert', recordToAdd);

	if (recordInsertionResponse.inserted == 1) {
		return true;
	}
	else {
		return recordInsertionResponse;
	}
}