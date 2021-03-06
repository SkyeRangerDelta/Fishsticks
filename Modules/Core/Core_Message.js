// ---- Message Handler ----
//===========================
//Handles message events

//Imports
const { log } = require('../Utility/Utils_Log');
const { fso_validate, hasPerms } = require('../Utility/Utils_User');
const { prefix } = require('../Core/Core_config.json');
const { fso_query } = require('../FSO/FSO_Utils');
const { generateErrorMsg, validateURL } = require('../Utility/Utils_Aux');
const { processXP } = require('../XP/XP_Core');
const extractUrls = require('extract-urls');

//Exports
module.exports = {
	processMessage
};

//Functions
async function processMessage(Fishsticks, msg) {
	//Member validation
	const memberFSORecord = await fso_validate(Fishsticks, msg);

	//Handler
	const cmdBreakup = msg.content.toLowerCase().substring(1, msg.content.length).split('-');
	const cmd = {
		ID: cmdBreakup.shift().trim(),
		content: [],
		msg: msg
	};

	//Trim content
	for (const param in cmdBreakup) {
		cmd.content.push(cmdBreakup[param].trim());
	}

	//Check BaconMode
	if (msg.author === Fishsticks.baconTarget) {
		msg.react('🥓');
	}

	//Do XP
	processXP(Fishsticks, cmd);

	//Handle Active Commands
	if (msg.content.startsWith(prefix)) {
		//Active Command
		log('info', '[ACTIVE-CMD] Incoming active command: ' + cmd.ID);

		try {
			const cmdFile = require(`../../Commands/Active/${cmd.ID}`);
			cmdFile.run(Fishsticks, cmd);

			//Success here
			log('info', '[ACTIVE-CMD] Executed successfully.');
			await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_MemberStats', 'update', {
				id: msg.author.id,
				acAttempts: ++memberFSORecord.acAttempts,
				acSuccess: ++memberFSORecord.acSuccess
			});
		}
		catch (activeCmdErr) {
			//Fail here
			log('warn', '[ACTIVE-CMD] Execution failed.\n' + activeCmdErr);
			await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_MemberStats', 'update', {
				id: msg.author.id,
				acAttempts: ++memberFSORecord.acAttempts
			});

			//Handle common error responses
			if (activeCmdErr.message.includes('../../Commands/Active/')) {
				msg.delete({ timeout: 0 }).then(sent => {
					sent.reply(generateErrorMsg() + '\nThats not a command.');
				});
			}
			else if (activeCmdErr.message.includes('../../Modules')) {
				msg.delete({ timeout: 0 }).then(sent => {
					sent.reply(generateErrorMsg() + `\nLooks like Im missing some major config somewhere and Im on the edge of losing it.\nPing ${Fishsticks.RANGER}`);
				});
			}
			else if (activeCmdErr.message.includes('Test mode')) {
				msg.delete({ timeout: 0 }).then(sent => {
					sent.reply(generateErrorMsg() + `\nThis is a test mode only command. It won't run unless ${Fishsticks.RANGER} is up to no good.`);
				});
			}
			else if (activeCmdErr.message.includes('No permissions')) {
				msg.delete({ timeout: 0 }).then(sent => {
					sent.reply(generateErrorMsg() + '\nLooks like you lack to necessary permissions to run this one.');
				});
			}
			else {
				msg.delete({ timeout: 0 }).then(sent => {
					sent.reply(generateErrorMsg() + '\n' + activeCmdErr.message);
				});
			}
		}
	}
	else {
		//Passive Command Handler

		const passiveID = msg.content.trim().toLowerCase().split(' ')[0];
		try {
			const passiveCmd = require(`../../Commands/Passive/${passiveID}.js`);
			passiveCmd.run(Fishsticks, cmd);
		}
		catch (passiveCmdErr) {
			log('info', '[PASSIVE-CMD] Attempt failed.');
		}
		finally {
			//Attempt possible unique scans

			//URL Scan Framework
			if (cmd.msg.content.includes('http://') || cmd.msg.content.includes('https://')) {
				console.log('URL scanner triggered.');
				//Link included in message; check poster perms
				if (!hasPerms(cmd.msg.member, ['Moderator', 'Event Coordinator', 'Council Advisor', 'Council Member'])) {
					//Not a staff member, check link
					const urls = extractUrls(cmd.msg.content);
					validateURL(cmd.msg, urls[0], true);
				}
			}
		}
	}
}