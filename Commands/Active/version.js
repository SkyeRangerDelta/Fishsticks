// ---- Version ----

//Imports
const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const packageVer = require( '../../package.json' ).version;

//Globals
const data = new SlashCommandBuilder()
	.setName( 'version' )
	.setDescription( 'Displays general FS information.' );

//Functions
function run( fishsticks, int ) {
	let branch = 'Master';
	if ( fishsticks.TESTMODE ) {
		branch = 'Experimental';
	}

	const versionPanel = {
		title: 'o0o - Fishsticks Version/About - o0o',
		description: 'This contains general info about Fishsticks.',
		color: fishsticks.CONFIG.colors.primary,
		footer: {
			text: `Panel was summoned by ${int.member.displayName}. This message will delete itself in 30 seconds.`
		},
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

    int.reply( { embeds: [embedBuilder( fishsticks, versionPanel )], ephemeral: true } );
}

function help() {
	return 'Displays general Fishsticks information.';
}

//Exports
module.exports = {
	name: 'version',
	data,
	run,
	help
};