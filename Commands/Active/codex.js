// ---- Codex ----

//Imports
const fs = require( 'fs' );
const { log } = require( '../../Modules/Utility/Utils_Log' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );

const cmdList = fs.readdirSync( './Commands/Active' ).filter( dirItem => dirItem.endsWith( '.js' ) );

//Functions
const data = new SlashCommandBuilder()
	.setName( 'codex' )
	.setDescription( 'Pulls up relevant information/how-to on a command.' );

data.addStringOption( o => o
	.setName( 'command-id' )
	.setDescription( 'The command ID (command name) to look up.' )
	.setRequired( true )
);

function run( fishsticks, int ) {
	log( 'info', '[CODEX] Attempting to find command.' );
	const cmdID = int.options.getString( 'command-id' ).toLowerCase();

    for ( const file in cmdList ) {
		const fileID = cmdList[file].substring( 0, cmdList[file].length - 3 );
		if ( fileID.toLowerCase() === cmdID ) {
			const helpFile = require( `./${fileID}` );
			const helpEntry = helpFile.help();
			return int.reply( { content: helpEntry + `\nThat entry can be found here: https://wiki.pldyn.net/fishsticks/command-listing#${fileID}`, ephemeral: true } );
		}
	}

	int.reply( { content: 'There is no such command.', ephemeral: true } );
}

function help() {
	return 'Provides more detailed info on a specific command.';
}

//Exports
module.exports = {
	name: 'codex',
	data,
	run,
	help
};