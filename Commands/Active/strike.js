// ---- Strike ----
//Issues a den strike to someone

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'strike' )
    .setDescription( 'Assigns a strike to a server member. [Mod+] [WIP]' );

//Functions
async function run( fishsticks, int ) {
    int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'strike', 'the command is still a WIP.' ) }`, ephemeral: true } );
}

function help() {
    return 'Moderation command for den strikes.';
}

//Exports
module.exports = {
    name: 'strike',
    data,
    run,
    help
};