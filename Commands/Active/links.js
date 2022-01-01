// ---- Links ----
// Displays useful CC related links

//Imports
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

//Exports
module.exports = {
	run,
	help
};

//Functions
function run(fishsticks, cmd) {
    cmd.msg.delete();

	const links = {
		title: 'o0o - CC GAMING LINKS - o0o',
		description: '[CC Gaming Website](https://www.ccgaming.com)\n' +
					'[CCG Discord Invite Link](https://discord.ccgaming.com)\n' +
					'[Official CCTV Twitch Stream](https://twitch.tv/christiancrewtv)\n' +
					'[Official CC YouTube Channel](https://www.youtube.com/user/ChristianCrewGaming)\n\n' +
					'[LCARS Database: Fishsticks](https://wiki.pldyn.net/en/fishsticks)\n' +
					'[LCARS Database: Guide to Fishsticks](https://wiki.pldyn.net/en/fishsticks/general-guide)',
		footer: 'Please report bad links.',
		delete: 20000
	};

    cmd.channel.send({ embeds: [embedBuilder(links)] })
		.then(s => { setTimeout(() => s.delete(), 20000); });
}

function help() {
	return 'Lists useful CC links.';
}