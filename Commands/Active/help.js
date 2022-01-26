// ---- Help ----

//Imports
const fs = require('fs');

const { primary } = require('../../Modules/Core/Core_config.json');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Prints out the help list.');

//Functions
function run(fishsticks, int) {
	const cmdList = fs.readdirSync('./Commands/Active').filter(cmdFile => cmdFile.endsWith('.js'));
	let helpMenu = '';

	for (const file in cmdList) {
		try {
			const cmdFileID = cmdList[file].substring(0, cmdList[file].length - 3);
			const helpFunc = require(`./${cmdFileID}`);
			const helpTxt = helpFunc.help();
			helpMenu = helpMenu.concat(`**${cmdFileID}**: ${helpTxt}\n`);
		}
		catch (helpListErr) {
			int.reply('Wait. Stop. No, something is off. Like literally turned off. ' + fishsticks.RANGER + ' Hey can you check on this please.');
			throw `${cmdList[file]} has no help entry!\n${helpListErr}`;
		}
	}

	const helpPanel = {
		title: 'o0o - Command Help - o0o',
		description: 'A brief command description listing.\n' +
						'------------------------------------\n' +
						helpMenu,
		color: primary,
		footer: 'Full Reference: https://wiki.pldyn.net/en/fishsticks/command-listing.',
		delete: 60000,
		noThumbnail: true
	};

	return int.reply({ embeds: [embedBuilder(helpPanel)], ephemeral: true });
}

function help() {
	return 'Displays the help menu. Duh.';
}

//Exports
module.exports = {
	name: 'help',
	data,
	run,
	help
};