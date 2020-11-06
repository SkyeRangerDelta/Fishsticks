// ---- Message Handler ----
//===========================
//Handles message events

//Imports
const { log } = require('../Utility/Utils_Log');
const { fso_validate } = require('../Utility/Utils_User');
const { prefix } = require('../Core/Core_config.json');
const { fso_query } = require('../FSO/FSO_Utils');
const { generateErrorMsg } = require('../Utility/Utils_Aux');

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
		content: cmdBreakup,
		msg: msg
	};

	//Check BaconMode
	if (msg.author === Fishsticks.baconTarget) {
		msg.react('🥓');
	}

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
		}
	}
}