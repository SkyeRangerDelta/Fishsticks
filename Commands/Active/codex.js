// ---- Codex ----

//Imports
const fs = require('fs');
const { log } = require('../../Modules/Utility/Utils_Log');

//Exports
module.exports = {
	run,
	help
};

//Functions
function run(fishsticks, cmd) {
	cmd.msg.delete();

	const cmdList = fs.readdirSync('./Commands/Active').filter(dirItem => dirItem.endsWith('.js'));

	log('info', '[CODEX] Attempting to find command.');

    for (const file in cmdList) {
		const fileID = cmdList[file].substring(0, cmdList[file].length - 3);
		if (fileID.toLowerCase() === cmd.content[0]) {
			const helpFile = require(`./${fileID}`);
			const helpEntry = helpFile.help();
			return cmd.channel.send(helpEntry + `\nThat entry can be found here: https://wiki.pldyn.net/fishsticks/command-listing#${fileID}`)
			.then(sent => {
				setTimeout(() => sent.delete(), 25000);
			});
		}
	}

	cmd.reply('There is no such command.', 10);
}

function help() {
	return 'Provides more detailed info on a specific command.';
}