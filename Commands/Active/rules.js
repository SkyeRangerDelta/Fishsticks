// ----- Rules -----
// Links to the rules channel

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'rules' )
    .setDescription( 'Links to #rules.' );

//Functions
async function run( fishsticks, int ) {
    const ruleCh = await fishsticks.channels.cache.get( fishsticks.ENTITIES.Channels[ 'rules' ] );
    int.reply( { content: `See ${ruleCh}`, flags: MessageFlags.Ephemeral } );
}

function help() {
    return 'Links to #rules. Super useful right?';
}

//Exports
module.exports = {
    name: 'rules',
    data,
    run,
    help
};