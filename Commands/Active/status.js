//----STATUS----
// Generates a status report on Fs systems

const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
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
		description: 'Fishsticks system state report.',
		fields: [
			{
				title: 'Application',
				description: fsoStatus.Online
			},
			{
				title: 'Session',
				description: fsoStatus.Session
			},
			{
				title: 'Startup Time',
				description: fsoStatus.StartupTime
			}
		]
	};

	//Send embed
	cmd.msg.channel.send({ embed: embedBuilder(statusReport) });
}

function help() {
	return 'Displays a list of all Fishsticks system states.';
}