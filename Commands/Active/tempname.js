// ---- Temp Name ----
// Changes the name of a temporary channel

//Imports
const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { log } = require( '../../Modules/Utility/Utils_Log' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'tempname' )
    .setDescription( 'Changes the name of a temporary channel.' );

data.addStringOption( o => o.setName( 'new-name' ).setDescription( 'The name to set the channel to.' ).setRequired( true ) );
data.addIntegerOption( o => o.setName( 'max-users' ).setDescription( 'Set a maximum user limit.' ).setRequired( false ) );

//Functions
async function run( fishsticks, int ) {
    const currChannel = int.member.voice.channel;
    if ( !currChannel ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'tempname', 'the user was not in the channel they wanted to change the name of.' ) }`, ephemeral: true } );
    }

    const chRes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'select', { id: currChannel.id } );
    if ( !chRes ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'tempname', 'the user tried to change the name of a non-temporary channel.' ) }`, ephemeral: true } );
    }

    //Syntax: /tempname new-name max-users
    const newTitle = int.options.getString( 'new-name' );
    const newUserLimit = int.options.getInteger( 'max-users' );

    if ( !newTitle ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'tempname', 'the user did not supply a new name for the channel.' ) }`, ephemeral: true } );
    }

    if ( !newUserLimit ) {
        await currChannel.setName( newTitle ).then( async editCh => {
            log( 'info', '[TEMP-NAME] Channel name changed to ' + newTitle );
            await fso_query( fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'update', { $set: { name: newTitle } }, { id: editCh.id } );

            return int.reply( {
                content: 'Done!',
                ephemeral: true
            } );
        } );
    }
    else {
        await currChannel.setName( newTitle ).then( async editCh => {
            editCh.setUserLimit( newUserLimit ).then( async editedCh => {
                log( 'info', '[TEMP-NAME] Channel name changed to ' + newTitle );
                await fso_query( fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'update', { $set: { name: newTitle, userLimit: newUserLimit } }, { id: editedCh.id } );

                return int.reply( {
                    content: 'Done!',
                    ephemeral: true
                } );
            } );
        } );
    }
}

function help() {
    return 'Changes the name of a temporary channel.';
}

//Exports
module.exports = {
    name: 'tempname',
    data,
    run,
    help
};