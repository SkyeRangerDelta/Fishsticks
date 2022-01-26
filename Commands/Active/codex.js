// ---- Codex ----

//Imports
const fs = require('fs');
const { log } = require('../../Modules/Utility/Utils_Log');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Functions
const data = new SlashCommandBuilder()
	.setName('codex')
	.setDescription('Pulls up relevant information/how-to on a command.');

data.addStringOption(o => o.setName('command-id').setDescription('The command ID (command name) to look up.').setRequired(true));

function run(fishsticks, int) {
	const cmdID = int.options.getString('command-id').toLowerCase();
	const cmdList = fs.readdirSync('./Commands/Active').filter(dirItem => dirItem.endsWith('.js'));

	log('info', '[CODEX] Attempting to find command.');

    for (const file in cmdList) {
		const fileID = cmdList[file].substring(0, cmdList[file].length - 3);
		if (fileID.toLowerCase() === cmdID) {
			const helpFile = require(`./${fileID}`);
			const helpEntry = helpFile.help();
			return int.reply(helpEntry + `\nThat entry can be found here: https://wiki.pldyn.net/fishsticks/command-listing#${fileID}`)
			.then(sent => {
				setTimeout(() => sent.delete(), 25000);
			});
		}
	}

	int.reply('There is no such command.');
}

function help() {
	return 'Provides more detailed info on a specific command.';
}

//Exports
module.exports = {
	name: 'codex',
	data,
	run,
	help
};