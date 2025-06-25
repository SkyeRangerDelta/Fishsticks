// ---- Help ----

//Imports
const fs = require( 'fs' );

const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

//Globals
const data = new SlashCommandBuilder()
	.setName( 'help' )
	.setDescription( 'Prints out the help list.' );

//Functions
async function run( fishsticks, int ) {
	const cmdList = fs.readdirSync( './Commands/Active' ).filter( cmdFile => cmdFile.endsWith( '.js' ) );
	let helpMenu = '';

	for ( const file in cmdList ) {
		try {
			const cmdFileID = cmdList[file].substring( 0, cmdList[file].length - 3 );
			const helpFunc = require( `./${cmdFileID}` );
			const helpTxt = helpFunc.help();
			helpMenu = helpMenu.concat( `**${cmdFileID}**: ${helpTxt}\n` );
		}
		catch ( helpListErr ) {
			int.reply( {
				content: `${ await getErrorResponse( int.client.user.displayName, 'help', 'the help article couldn\'t be found.' ) }`,
				ephemeral: true
			} );
			throw `${cmdList[file]} has no help entry!\n${helpListErr}`;
		}
	}

	const helpPanel = {
		title: 'o0o - Command Help - o0o',
		description: 'A brief command description listing.\n' +
						'------------------------------------\n' +
						helpMenu,
		color: fishsticks.CONFIG.colors.primary,
		footer: {
			text: 'Full Reference: https://wiki.pldyn.net/en/fishsticks/command-listing.'
		},
		delete: 60000,
		noThumbnail: true
	};

	return int.reply( { embeds: [embedBuilder( fishsticks, helpPanel )], ephemeral: true } );
}

function help() {
	return 'Displays the help menu. Duh.';
}

//Exports
module.exports = {
	name: 'help',
	data,
	run,
	help
};