// ---- Aux Utils ----

//Imports
const { debater, hangout } = require('../../Modules/Core/Core_ids.json');
//const { urlscanIO } = require('../Core/Core_keys.json');
const { discussionDenRules } = require('../Library/systemResponses.json');

const { buildPoem } = require('../../Commands/Active/poem');
const { startApp } = require('../../Commands/Active/apply');
const { hasPerms } = require('./Utils_User');
const { embedBuilder } = require('./Utils_EmbedBuilder');
const { log } = require('../Utility/Utils_Log');
const { fso_query } = require('../FSO/FSO_Utils');
const { handleAddedReaction } = require('../../Commands/Active/poll');

//const axios = require('axios');

//Exports
module.exports = {
	validateAddedReaction,
	//validateURL,
	doDailyPost,
	toTitleCase,
	handleDenMsg
};

//Globals
//const urlTests = [];

//Functions
async function validateAddedReaction(fishsticks, addedReaction, reactor) {
	//Void reactions from FS
	if (reactor === fishsticks.user) return;
	if (reactor.id === fishsticks.id) return;

	//Sort through all known ID checks and find which one is in question

	//Check for poll response
	const polls = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'selectAll');
	for (const id in polls) {
		if (addedReaction.message.id === polls[id].id) {
			return handleAddedReaction(fishsticks, addedReaction, reactor, polls[id]);
		}
	}

	//Check CCG Membership Apps
	for (const ID in fishsticks.appMsgIDs) {
		if (addedReaction.message.id === fishsticks.appMsgIDs[ID]) {
			return startApp(fishsticks, reactor);
		}
	}

	//Check for Debater apps
	for (const ID in fishsticks.debMsgIDs) {
		log('info', '[DEBATER] Checking IDs for debater rules acceptance.');
		if (addedReaction.message.id === fishsticks.debMsgIDs[ID]) {
			const member = await fishsticks.CCG.members.fetch(reactor.id);
			if (!member) throw 'Couldnt validate the member!';

			const debRole = await fishsticks.CCG.roles.fetch(debater);
			if (!debRole) throw 'Couldnt validate the debater role!';

			return await member.roles.add(debRole)
				.then(() => {
					member.createDM()
						.then((DMCh) => {
							DMCh.send({ content: 'Debater role assigned!' }).catch(console.error);
						})
						.catch(console.error);
				});
			//TODO: Debater app start
		}
	}
}

function doDailyPost(fishsticks) {
	const hangoutCH = fishsticks.CCG.channels.cache.get(hangout);
	hangoutCH.send({ embeds: [buildPoem()] });
}

//Root func for URL scans
/*
async function validateURL(msg, urlArr) {
	const testResMsg = 'Running a quick test for any malicious content...\n';

	//React message
	await msg.react('🕓');
	const testNotice = await msg.reply(testResMsg);

	//Loop through URLs
	for (const link in urlArr) {

		setTimeout(async function() {
			const scanUUID = await fetchURLScan(urlArr[link]);

			log('info', '[URL-SCAN] Received a new url to scan.');
			urlTests.push({
				url: urlArr[link],
				uuid: scanUUID,
				result: 'WAITING',
				d: `[🕓] Link ${link + 1}: ${urlArr[link]}\n`,
				msg: await testNotice.channel.send(`[🕓] Link ${link + 1}: <${urlArr[link]}>\n`)
			});
		}, 3000);
	}

	//Send UUID data to report requester
	for (const urlToTest in urlTests) {
		setTimeout(function() {
			fetchURLScanResult(testNotice, msg, urlTests[urlToTest]);
		}, 45000);
	}
}

//Submit the URL scan; return the UUID
async function fetchURLScan(urlToScan) {

	axios({
		method: 'post',
		url: 'https://urlscan.io/api/v1/scan/',
		headers: {
			'API-Key': urlscanIO,
			'Content-Type': 'application/json'
		},
		data: {
			'url': urlToScan,
			'visibility': 'public'
		}
	}).then(res => {
		console.log(res.status + ' : ' + res.statusText + ' : ' + res.data.uuid);
		return res.data.uuid;
	});

	log('info', '[URL-SCAN] Beginning scan on ' + urlToScan);
}

//Use the UUID to retrieve the scan
function fetchURLScanResult(testNotice, msg, urlObj) {

	log('info', '[URL-SCAN] Attempting to retrieve results of URL scan.');

	axios({
		url: 'https://urlscan.io/api/v1/result/' + urlObj.uuid,
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => {
		return processURLReport(testNotice, msg, res.data, urlObj);
	});
}

//Update message accordingly to scan report
async function processURLReport(testNotice, msg, scanResult, urlObj) {
	log('info', '[URL-SCAN] Received report status: ' + scanResult.statusCode);

	if (scanResult.statusCode === 404) {
		//Scan not finished...update notice and wait 15 for scan res
		log('info', '[URL-SCAN] Report not ready; standing by for 15s.');

		await testNotice.edit('Tests arent quite done yet, gimmie a few seconds...');

		setTimeout(function() {
			fetchURLScanResult(testNotice, msg, scanResult);
		}, 15000);
	}
	else {
		//Scan done, update notice and relevant link msg
		await msg.reactions.removeAll();

		const verdicts = scanResult.verdicts;

		console.log(scanResult);

		if (verdicts.overall.score === 0) {
			log('info', '[URL-SCAN] URL scan looks good.');

			urlObj.msg.edit(`[✔] Scan done. Verdict: ${verdicts.overall.score}% malicious. Looks clean.`);
		}
		else if (verdicts.overall.score >= 10 && verdicts.overall.score < 50) {
			log('info', '[URL-SCAN] URL scan looks questionable.');

			urlObj.msg.edit(`[⚠] Scan done. Verdict: ${verdicts.overall.score}% malicious. Looks good for the most part but is questionable Proceed with caution.`);
		}
		else {
			log('info', '[URL-SCAN] URL scan reports significant activity.');

			msg.delete({ timeout: 0 });

			urlObj.msg.edit(`[❌] Scan done. Verdict: ${verdicts.overall.score}% malicious. Do not follow the link or post it in any of the chats. I have removed the message containing this link.`);
		}
	}
}

*/

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

//Handle Den Permissions
async function handleDenMsg(cmd, fishsticks) {
	if (!hasPerms(cmd.msg.member, ['Debater'])) {
		const msgDeleted = cmd.msg.content;
		cmd.msg.delete();

		const denMsg = {
			title: 'o0o - Discussion Den Rules - o0o',
			footer: {
				text: 'You were sent this message because you posted in the Discussion Den without accepting the rules.'
			},
			description: discussionDenRules
		};

		await cmd.msg.author.send({ embeds: [embedBuilder(denMsg)] })
			.then(sent => {
				sent.react('✅');
				fishsticks.debMsgIDs.push(sent.id);
			})
			.catch(e => {
				console.log('HERE!\n' + e);
				return cmd.reply('Looks like you have your DMs disabled for me! Please look into your privacy settings!', 15);
			});

		const conMsg = 'For your convenience; below is the message you attempted to send to the den (posts are deleted):\n```' + msgDeleted + '```';

		await cmd.msg.author.send(conMsg);

		return cmd.reply('You need to agree to the den rules before posting here! Check your DMs!', 20);
		//182291777275822090
	}
}