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
	cmd.msg.delete({ timeout: 0 });

	const cmdList = fs.readdirSync('./').filter(dirItem => dirItem.endsWith('.js'));

	log('info', '[CODEX] Attempting to find command.');

    for (const file in cmdList) {
		const fileID = cmdList[file].substring(0, cmdList[file].length - 3);
		if (fileID.toLowerCase() == cmd.content[0]) {
			const helpEntry = require(`./${fileID}`).codex;
			return cmd.msg.channel.send(helpEntry + '\nThat entry can be found here: https://wiki.pldyn.net/fishsticks/command-listing#${entry}')
			.then(sent => sent.delete({ timeout: 15000 }));
		}
	}

	cmd.msg.channel.send('What, are you looking for something? Thats not a command youre looking for.').then(sent => sent.delete(10000));
}

function help() {
	return 'Provides more detailed info on a specific command.';
}