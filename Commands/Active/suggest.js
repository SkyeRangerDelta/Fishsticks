// ----SUGGEST----
// Posts an issue to the Fs GitHub via Webhook

//Imports
const https = require( 'https' );

const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );

const { log } = require( '../../Modules/Utility/Utils_Log' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'suggest' )
    .setDescription( 'Posts a suggestion to the FS GitHub repository.' )
    .addStringOption( o => o
        .setName( 'subject' )
        .setDescription( 'Title of your suggest, quick reference.' )
        .setRequired( true ) )
    .addStringOption( o => o
        .setName( 'content' )
        .setDescription( 'The actual content of the suggestion, details please.' )
        .setRequired( true )
    );

async function run( fishsticks, int ) {
    //Syntax: /suggest subject content
    int.deferReply( { ephemeral: true } );

    const title = int.options.getString( 'subject' );
    const content = int.options.getString( 'content' );
    const fsSuggestionHook = process.env.FS_SUGGESTION_HOOK;

    if ( !fsSuggestionHook ) {
        log( 'error', '[SUGGEST] [API] API credentials not found!' );
        return int.editReply( {
            content: 'Something went wrong. Ask Skye to investigate.',
            ephemeral: true
        } );
    }

    let hookURL = fsSuggestionHook.concat( `?sender=${int.member.displayName}&suggTitle=${title}&suggBody=${content}` );
    hookURL = encodeURI( hookURL );

    //Attempt suggestion send
    log( 'info', '[SUGGEST] Dispatching a request.' );
    https.get( hookURL, ( res ) => {
        if ( res.statusCode === 200 ) {
            log( 'info', '[SUGGEST] Status: ' + res.statusCode );
            return int.editReply( { content: 'Suggestion posted.', ephemeral: true } );
        }
    } ).on( 'error', ( eventGetError ) => {
        console.log( eventGetError );
        return int.editReply( {
            content: 'Something isnt working.',
            ephemeral: true
        } );
    } );

    //FSO Sync Suggestions
    log( 'info', '[SUGGEST] Syncing member suggestions' );

    const updateData = {
        $inc: {
            suggestionsPosted: 1
        }
    };

    const updatedMember = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', updateData, { id: int.member.id } );

    if ( updatedMember.modifiedCount === 1 ) {
        log( 'proc', '[SUGGEST] Synced.' );
    }
    else {
        return int.followUp( { content: 'Something went wrong. Ask Skye to investigate.' } );
    }
}

function help() {
    return 'Posts a GitHub issue to the Fishsticks repository.';
}

//Exports
module.exports = {
    name: 'suggest',
    data,
    run,
    help
};