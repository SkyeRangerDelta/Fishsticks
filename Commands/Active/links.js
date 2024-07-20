// ---- Links ----
// Displays useful CC related links

//Imports
const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );

//Globals
const data = new SlashCommandBuilder()
	.setName( 'links' )
	.setDescription( 'Displays useful CC links.' );

//Functions
function run( fishsticks, int ) {
	const links = {
		title: 'o0o - CC GAMING LINKS - o0o',
		description: '[CC Gaming Website](https://www.ccgaming.com)\n' +
					'[CCG Discord Invite Link](https://discord.ccgaming.com)\n' +
					'[Official CCTV Twitch Stream](https://twitch.tv/christiancrewtv)\n' +
					'[Official CC YouTube Channel](https://www.youtube.com/user/ChristianCrewGaming)\n\n' +
					'[LCARS Database: Fishsticks](https://wiki.pldyn.net/en/fishsticks)\n' +
					'[LCARS Database: Guide to Fishsticks](https://wiki.pldyn.net/en/fishsticks/general-guide)\n' +
					'[LCARS Database: Command Listing/Help](https://wiki.pldyn.net/en/fishsticks/command-listing)',
		footer: {
			text: 'Please report bad links.'
		},
		delete: 20000
	};

	int.reply( { embeds: [embedBuilder( links )], ephemeral: true } );
}

function help() {
	return 'Lists useful CC links.';
}

//Exports
module.exports = {
	name: 'links',
	data,
	run,
	help
};
