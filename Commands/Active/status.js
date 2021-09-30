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
	cmd.msg.delete({ timeout: 0 });

	//Get FSO status
	const fsoStatus = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Status', 'selectAll');

	//Const build embed
	const statusReport = {
		title: 'o0o - Fishsticks Status Report - o0o',
		description: 'Fishsticks system state report.',
		fields: [
			{
				name: 'Application',
				value: fsoStatus.Online
			},
			{
				name: 'Session',
				value: fsoStatus.Session
			},
			{
				name: 'Startup Time',
				value: fsoStatus.StartupTime
			}
		],
		footer: 'Status is subject to sudden changes.'
	};

	//Send embed
	await cmd.channel.send({ embeds: [embedBuilder(statusReport)] });
}

function help() {
	return 'Displays a list of all Fishsticks system states.';
}