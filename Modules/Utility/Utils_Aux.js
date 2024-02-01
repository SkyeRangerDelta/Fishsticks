// ---- Aux Utils ----

//Imports
const { debater, hangout } = require('../../Modules/Core/Core_ids.json');
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
	doDailyPost,
	toTitleCase,
	handleDenMsg
};

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
		}
	}
}

function doDailyPost(fishsticks) {
	const hangoutCH = fishsticks.CCG.channels.cache.get(hangout);
	hangoutCH.send({ embeds: [buildPoem()] });
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