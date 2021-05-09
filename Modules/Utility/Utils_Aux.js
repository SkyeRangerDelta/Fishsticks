// ---- Aux Utils ----

//Imports
const errorMsgPool = require('../Library/errorMsgs.json');
const { hangout } = require('../../Modules/Core/Core_ids.json');
const { urlscanIO } = require('../Core/Core_keys.json');

const { buildPoem } = require('../../Commands/Active/poem');
const { startApp } = require('../../Commands/Active/apply');
const { log } = require('../Utility/Utils_Log');

const urlscan = require('urlscan-api');

//Exports
module.exports = {
	generateErrorMsg,
	validateReaction,
	doDailyPost,
	validateURL,
	toTitleCase
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
		if (addedReaction.message.id === fishsticks.appMsgIDs[ID]) {
			startApp(fishsticks, reactor);
		}
	}

	//Check for Debator apps
	for (const ID in fishsticks.debMsgIDs) {
		if (addedReaction.message.id === fishsticks.debMsgIDs[ID]) {
			//TODO: Debator app start
		}
	}
}

function doDailyPost(fishsticks) {
	const hangoutCH = fishsticks.CCG.channels.cache.get(hangout);
	hangoutCH.send({ embed: buildPoem() });
}

//Root func for URL scans
async function validateURL(msg, urlToScan, inline) {
	log('info', '[URL-SCAN] Beginning scan on ' + urlToScan);
	const urlID = await fetchURLScan(urlToScan);

	await msg.react('🕓');

	setTimeout(function() {
		fetchURLScanResult(msg, urlID, inline);
	}, 45000);


}

//Submit the URL scan; return the UUID
async function fetchURLScan(urlToScan) {

	const output = await new urlscan().submit(urlscanIO, urlToScan);
	return output.uuid;
}

//Use the UUID to retrieve the scan
function fetchURLScanResult(msg, urlID, inline) {

	log('info', '[URL-SCAN] Attempting to retrieve results of URL scan.');

	new urlscan().result(urlID).then(output => {
		return processURLReport(msg, output, urlID, inline);
	});
}

//Update message accordingly to scan report
async function processURLReport(msg, report, subRes, inline) {
	log('info', '[URL-SCAN] Received report status: ' + report.statusCode);

	if (report.statusCode == 404) {

		log('info', '[URL-SCAN] Report not ready; standing by for 15s.');

		if (!inline) {
			msg.edit('Just a bit longer... (report still pending)');
		}

		setTimeout(function() {
			report = fetchURLScanResult(msg, subRes);
		}, 15000);
	}
	else {

		await msg.reactions.removeAll();

		const verdicts = report.verdicts;

		if (verdicts.overall.score == 0) {
			log('info', '[URL-SCAN] URL scan looks good.');

			if (!inline) {
				msg.edit(`[✔️] Scan done. Verdict: ${verdicts.overall.score}% malicious. Looks clean.`);
			}
			else {
				msg.react('✔️');
			}
		}
		else if (verdicts.overall.score >= 10 && verdicts.overall.score < 50) {
			log('info', '[URL-SCAN] URL scan looks questionable.');

			if (!inline) {
				msg.edit(`[⚠️] Scan done. Verdict: ${verdicts.overall.score}% malicious. Looks good for the most part but is questionable Proceed with caution.`);
			}
			else {
				msg.react('⚠️');
				msg.reply('Your post looks like it has a link in it that I have deemed to be of questionable intent. Proceed with caution, a staff member will likely vet this soon.');
			}
		}
		else {
			log('info', '[URL-SCAN] URL scan reports significant activity.');

			if (!inline) {
				msg.edit(`[❌] Scan done. Verdict: ${verdicts.overall.score}% malicious. Do not follow the link or post it in any of the chats.`);
			}
			else {
				msg.reply('Your post contained a link that I have deemed to be highly malicious and I have removed it as a preventative measure. If this is by mistake, please have a staff member replace the link.');
				msg.delete({ timeout: 0 });
			}
		}
	}
}

//Convert to title case
function toTitleCase(toConvert) {
    let breakupArr = toConvert.split(' ');

    for (const breakupEle in breakupArr) {
        const tempLetter = breakupArr[breakupEle].charAt(0).toUpperCase();
        breakupArr[breakupEle] = tempLetter + breakupArr[breakupEle].substring(1, breakupArr[breakupEle].length);
    }

    breakupArr = breakupArr.join(' ');

    log('info', '[UTILITY] Converted title to: ' + breakupArr);

    return breakupArr;
}