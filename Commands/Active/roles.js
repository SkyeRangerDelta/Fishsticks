//----ROLES----
// Lists all roles

//Imports
const { listRoles } = require( './role' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );

//Globals
const data = new SlashCommandBuilder()
	.setName( 'roles' )
	.setDescription( 'Lists all the game/user roles.' );

//Functions
async function run( fishsticks, int ) {
	int.deferReply( { flags: MessageFlags.Ephemeral } );
	await listRoles( fishsticks, int, true );
}

function help() {
	return 'Lists roles (toggled via parameter).';
}

//Exports
module.exports = {
	name: 'roles',
	data,
	run,
	help
};