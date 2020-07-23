const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const config = require('../../Modules/Core/Core_sys.json');
const packageVer = require('../../package.json').version;

module.exports = {
	run,
	help
};

function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

	const versionPanel = {
		title: 'o0o - Fishsticks Version/About - o0o',
		description: 'This contains general info about Fishsticks.',
		color: config.color,
		footer: `Panel was summoned by ${cmd.msg.author.username}. This message will delete itself in 30 seconds.`,
		timeout: 30000,
		fields: [
			{
				title: 'Version: ',
				description: packageVer
			},
			{
				title: 'Current Status: ',
				description: 'Blah',
			},
			{
				title: 'Fishsticks GitHub Repository',
				description: '[Official Fishsticks Repo](https://github.com/SkyeRangerDelta/Fishsticks)'
			},
			{
				title: 'Complete Fishsticks Guide',
				description: '[KBase Article](https://forums.ccgaming.com/kb/viewarticle?a=3)'
			}
		]
	};

    cmd.msg.channel.send({ embed: embedBuilder(versionPanel) }).then(sent => sent.delete({ timeout: 30000 }));
}

function help() {
	return 'Displays general Fishsticks information.';
}