// ---- Version ----

//Imports
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const config = require('../../Modules/Core/Core_config.json');
const packageVer = require('../../package.json').version;

//Exports
module.exports = {
	run,
	help
};

//Functions
function run(fishsticks, cmd) {
	cmd.msg.delete();

	let branch = 'Master';
	if(fishsticks.TESTMODE) {
		branch = 'Experimental';
	}

	const versionPanel = {
		title: 'o0o - Fishsticks Version/About - o0o',
		description: 'This contains general info about Fishsticks.',
		color: config.colors.primary,
		footer: `Panel was summoned by ${cmd.msg.author.username}. This message will delete itself in 30 seconds.`,
		timeout: 30000,
		fields: [
			{
				name: 'Version:',
				value: `${packageVer}`
			},
			{
				name: 'Branch:',
				value: `${branch}`
			},
			{
				name: 'Current Status:',
				value: `ONLINE: Watching for !help | ${packageVer}`,
			},
			{
				name: 'Fishsticks GitHub Repository',
				value: '[Official Fishsticks Repo](https://github.com/SkyeRangerDelta/Fishsticks)'
			}
		]
	};

    cmd.channel.send({ embeds: [embedBuilder(versionPanel)] })
		.then(s => { setTimeout(() => s.delete(), 30000); });
}

function help() {
	return 'Displays general Fishsticks information.';
}