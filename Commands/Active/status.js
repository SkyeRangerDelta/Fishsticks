//----STATUS----
// Generates a status report on Fs systems

const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { convertMsFull } = require('../../Modules/Utility/Utils_Time');

//Exports
module.exports = {
	run,
	help
};

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

	//Get FSO status
	const fsoStatus = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Status', 'select', { id: 1 });
	const memberStats = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'count');

	console.log(fsoStatus);

	const timeNow = Date.now();

	//Const build embed
	const statusReport = {
		title: 'o0o - Fishsticks Status Report - o0o',
		description: 'Fishsticks system state report.',
		fields: [
			{
				name: 'Application State',
				value: toggle(fsoStatus.Online),
				inline: true
			},
			{
				name: 'Session',
				value: `${fsoStatus.Session}`,
				inline: true
			},
			{
				name: 'Startup Time',
				value: fsoStatus.StartupTime,
				inline: true
			},
			{
				name: 'Successful Commands',
				value: `${fsoStatus.cmdQueriesSucc}`,
				inline: true
			},
			{
				name: 'Failed Commands',
				value: `${fsoStatus.cmdQueriesFail}`,
				inline: true
			},
			{
				name: 'Command Executions',
				value: `${fsoStatus.cmdQueriesSucc + fsoStatus.cmdQueriesFail}`,
				inline: true
			},
			{
				name: 'FSO Queries',
				value: `${fsoStatus.Queries}`,
				inline: true
			},
			{
				name: 'Uptime',
				value: convertMsFull(fsoStatus.StartupUTC - timeNow),
				inline: true
			},
			{
				name: 'Random Msg Tick',
				value: `${fsoStatus.rMsgTick}`,
				inline: true
			},
			{
				name: 'Member Records',
				value: `${memberStats}`,
				inline: true
			},
			{
				name: 'Owner',
				value: 'SkyeRangerDelta',
				inline: true
			}
		],
		footer: 'Status is subject to sudden changes.'
	};

	//Send embed
	cmd.channel.send({ embeds: [embedBuilder(statusReport)] });
}

function help() {
	return 'Displays a list of all Fishsticks system states.';
}

function toggle(t) {
	if (t) {
		return 'Online';
	}
	else {
		return 'Offline';
	}
}