// ---- Say ----

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { ranger } = require( '../../Modules/Core/Core_ids.json' );

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
    if ( int.author.id !== ranger ) {
        return await int.reply( { content: 'You do not have permission to use this command.', ephemeral: true } );
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