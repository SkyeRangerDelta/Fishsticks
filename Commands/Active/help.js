// ---- Help ----

//Imports
const fs = require('fs');

const { primary } = require('../../Modules/Core/Core_config.json');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

//Exports
module.exports = {
	run,
	help
};

//Functions
function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

	cmd.msg.channel.send('Building help menu...').then(sent => sent.delete({ timeout: 10000 }));

	const cmdList = fs.readdirSync('./Commands/Active').filter(cmdFile => cmdFile.endsWith('.js'));
	let helpMenu = '';

	for (const file in cmdList) {
		try {
			const helpFunc = require(`./${cmdList[file]}`).help;
			const cmdFileID = cmdList[file].substring(0, cmdList[file].length - 3);
			helpMenu = helpMenu.concat(`**${cmdFileID}**: ${helpFunc}`);
		}
		catch (helpListErr) {
			cmd.msg.reply({ content: 'Wait. Stop. No, something is off. Like literally turned off. ' + fishsticks.RANGER + ' Hey can you check on this please.' });
			throw `${cmdList[file]} has no help entry!\n${helpListErr}`;
		}
	}

	const helpPanel = {
		title: 'o0o - Command Help - o0o',
		description: 'A brief command description listing.\n' +
						'------------------------------------\n' +
						helpMenu,
		color: primary,
		footer: 'Full Reference: https://wiki.pldyn.net/en/fishsticks/command-listing',
		delete: 60000
	};

	cmd.msg.channel.send({ embeds: [embedBuilder(helpPanel)] }).then(sent => sent.delete(helpPanel.delete));
}

function help() {
	return 'Displays this menu.';
}