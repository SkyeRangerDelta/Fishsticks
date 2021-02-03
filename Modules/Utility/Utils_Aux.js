// ---- Aux Utils ----

//Imports
const errorMsgPool = require('../Library/errorMsgs.json');
const { startApp } = require('../../Commands/Active/apply');
const { hangout } = require('../../Modules/Core/Core_ids.json');
const { buildPoem } = require('../../Commands/Active/poem');

//Exports
module.exports = {
	generateErrorMsg,
	validateReaction,
	doDailyPost
};

//Functions
function generateErrorMsg() {
	const msgNum = Math.floor(Math.random() * errorMsgPool.length);
	return '*' + errorMsgPool[msgNum] + '* ';
}

function validateReaction(fishsticks, addedReaction, reactor) {
	//Sort through all known ID checks and find which one is in question

	//Check CCG Membership Apps
	for (const ID in fishsticks.appMsgIDs) {
		if (addedReaction.message.id == fishsticks.appMsgIDs[ID]) {
			startApp(fishsticks, reactor);
		}
	}

	//Check for Debator apps
	for (const ID in fishsticks.debMsgIDs) {
		if (addedReaction.message.id == fishsticks.debMsgIDs[ID]) {
			//TODO: Debator app start
		}
	}
}

function doDailyPost(fishsticks) {
	const hangoutCH = fishsticks.CCG.channels.cache.get(hangout);
	hangoutCH.send({ embed: buildPoem() });
}