// ----SUGGEST----
// Posts an issue to the Fs GitHub via Webhook

//Imports
const https = require( 'https' );
const fs = require( 'fs' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { sign } = require( "jsonwebtoken" );

const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { log } = require( '../../Modules/Utility/Utils_Log' );

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

    const clientId = process.env.GIT_CLIENT_ID;
    const gitURI = process.env.GIT_URI;

    const issuesURL = `${gitURI}/issues`;

    if ( !clientId || clientId.length === 0 ) {
        log( 'error', '[SUGGEST] [API] API ID credential not found!' );
        return int.editReply( {
            content: 'Something went wrong. Ask Skye to investigate.',
            ephemeral: true
        } );
    }

    //Attempt suggestion send
    log( 'info', '[SUGGEST] Dispatching a request.' );

    const res = axios.post(
        issuesURL,
        {
            title: title,
            body: content
        },
        {
            headers: {
                Authorization: `token ${ fishsticks.GIT_INSTALL_TOKEN }`,
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'Fishsticks'
            }
        }
    )

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