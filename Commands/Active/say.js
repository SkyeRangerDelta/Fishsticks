// ---- Say ----

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'say' )
    .setDescription( 'Say something as FS.' );

data.addStringOption( s => s
    .setName( 'msg-content' )
    .setDescription( 'The message to say.' )
    .setRequired( true )
);

//Functions
async function run( fishsticks, int ) {
    if ( int.author.id !== fishsticks.ENTITIES.Users[ 'skyerangerdelta' ] ) {
        return await int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'say', 'the user didn\'t have permission to use the command.' ) }`, ephemeral: true } );
    }

    await int.channel.send( { content: `${ int.options.getString( 'msg-content' ) }` } );
    await int.reply( { content: 'Message sent.', ephemeral: true } );
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