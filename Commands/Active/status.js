//----STATUS----
// Generates a status report on Fs systems

const { fso_query } = require('../../Modules/FSO/FSO_Utils');

//Exports
module.exports = {
	run,
	help
};

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.reply('Hey.');

	//Get FSO status
	const fsoStatus = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Status', 'selectAll');

	//Const build embed
	const statusReport = {
		title: 'o0o - Fishsticks Status Report - o0o',
		description: ''
	};
}

function help() {
	return 'Displays a list of all Fishsticks system states.';
}