// ----SUGGEST----
// Posts an issue to the Fs GitHub via Webhook

//Imports
const https = require( 'https' );
const fs = require( 'fs' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );
const { sign } = require( "jsonwebtoken" );

const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { log } = require( '../../Modules/Utility/Utils_Log' );
const axios = require( "axios" );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

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
    int.deferReply( { flags: MessageFlags.Ephemeral } );

    if ( !fishsticks.GIT_INSTALL_TOKEN ||
      fishsticks.GIT_INSTALL_TOKEN_GEN_TIME < Date.now() - 1000 * 60 * 60
    ) {
        await getAppInstallInfo( fishsticks );
    }

    const title = int.options.getString( 'subject' );
    const content = int.options.getString( 'content' );

    const gitURI = process.env.GIT_URI;

    const issuesURL = `${gitURI}/issues`;

    //Attempt suggestion send
    log( 'info', '[SUGGEST] Dispatching a request.' );

    let res;
    try {
        res = await axios.post(
            issuesURL,
            {
              title: title,
                body: `${ content }\n\n*(Suggestion posted from CCG's Discord server.)*`,
                labels: [ 'On the Whiteboard' ]
            },
            {
              headers: {
                  Authorization: `token ${ fishsticks.GIT_INSTALL_TOKEN }`,
                  Accept: 'application/vnd.github.v3+json',
                  'User-Agent': 'Fishsticks'
              }
            }
        );
    }
    catch ( postError ) {
        //Try to generate a new token if the current one is invalid and retry
        if ( postError.response && postError.response.status === 401 ) {
            log( 'warn', '[SUGGEST] Invalid GitHub token, attempting to regenerate.' );
            const success = await getAppInstallInfo( fishsticks );

            if ( !success ) {
                log( 'error', '[SUGGEST] Failed to regenerate GitHub token.' );
                return int.followUp( { content: `${ await getErrorResponse( int.client.user.displayName, 'suggest', 'the command got a bad response from the server about posting the suggestion issue to GitHub.' ) }` } );
            }

            //Retry the request with the new token
            try {
                const retryRes = await axios.post(
                  issuesURL,
                  {
                      title: title,
                      body: `${ content }\n\n*(Suggestion posted from CCG's Discord server.)*`,
                      labels: [ 'On the Whiteboard' ]
                  },
                  {
                      headers: {
                          Authorization: `token ${ fishsticks.GIT_INSTALL_TOKEN }`,
                          Accept: 'application/vnd.github.v3+json',
                          'User-Agent': 'Fishsticks'
                      }
                  }
                );

                if ( retryRes.status === 200 ) {
                    log( 'info', '[SUGGEST] Suggestion posted successfully after token regeneration.' );
                    return int.followUp( { content: 'Your suggestion has been posted successfully!' } );
                }
            }
            catch ( retryError ) {
                log( 'error', `[SUGGEST] Failed to post suggestion after token regeneration: ${retryError.message}` );
                return int.followUp( { content: `${ await getErrorResponse( int.client.user.displayName, 'suggest', 'the command got a bad response from the server about posting the suggestion issue to GitHub.' ) }` } );
            }
        }

        log( 'error', `[SUGGEST] Failed to post suggestion: ${postError.message}` );
        return int.followUp( { content: `${ await getErrorResponse( int.client.user.displayName, 'suggest', 'the command got a bad response from the server about posting the suggestion issue to GitHub.' ) }` } );
    }

    if ( res.status !== 201 ) {
        log( 'error', `[SUGGEST] Failed to post suggestion: ${res.status} - ${res.statusText}` );
        return int.followUp( { content: `${ await getErrorResponse( int.client.user.displayName, 'suggest', 'the command got a bad response from the server about posting the suggestion issue to GitHub.' ) }` } );
    }

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
        return int.followUp( { content: `${ await getErrorResponse( int.client.user.displayName, 'suggest', 'something went wrong trying to open the GitHub issue.' ) }` } );
    }

    log( 'info', '[SUGGEST] Suggestion posted successfully.' );
    return int.followUp( { content: 'Your suggestion has been posted successfully!' } );
}

function help() {
    return 'Posts a GitHub issue to the Fishsticks repository.';
}

async function getAppInstallInfo( Fishsticks ) {
    if ( !process.env.GIT_KEY_PATH || !process.env.GIT_CLIENT_ID || !process.env.GIT_ACCT ) {
        log( 'error', '[SUGGEST] [API] GitHub credentials not found in environment variables!' );
        return false;
    }

    let pk;
    try {
        pk = fs.readFileSync( process.env.GIT_KEY_PATH, 'utf8' );
    }
    catch ( keyPathReadError ) {
        log( 'error', '[SUGGEST] [API] Failed to read GitHub private key: ' + keyPathReadError.message );
        return false;
    }

    const clientId = process.env.GIT_CLIENT_ID;

    if ( !clientId || clientId.length === 0 ) {
        log( 'error', '[SUGGEST] [API] API ID credential not found!' );
        return false;
    }

    if ( !pk || pk.length === 0 ) {
        log( 'error', '[SUGGEST] [API] API credentials key not found!' );
        return false;
    }

    const JWT = sign( {
          iss: clientId,
          exp: Math.floor( Date.now() / 1000 ) + 60,
          iat: Math.floor( Date.now() / 1000 )
      },
      pk,
      { algorithm: 'RS256' }
    );

    let appInstallsRes;
    try {
        appInstallsRes = await axios.get(
          'https://api.github.com/app/installations',
          {
              headers: {
                  Authorization: `Bearer ${ JWT }`,
                  Accept: 'application/vnd.github.v3+json'
              }
          }
        )
    }
    catch ( agError ) {
        log( 'error', '[SUGGEST] [API] Failed to get app installations: ' + agError.message );
        return false;
    }

    const appInstalls = appInstallsRes.data.find( i => i.account.login === process.env.GIT_ACCT );

    if ( !appInstalls ) {
        log( 'error', '[SUGGEST] [API] App installation not found for account: ' + process.env.GIT_ACCT );
        return false;
    }

    const installId = appInstalls.id;

    let appInstallToken;
    try {
        appInstallToken = await axios.post(
          `https://api.github.com/app/installations/${ installId }/access_tokens`,
          {},
          {
              headers: {
                  Authorization: `Bearer ${ JWT }`,
                  Accept: 'application/vnd.github.v3+json'
              }
            }
        );
    }
    catch ( apError ) {
        log( 'error', '[SUGGEST] [API] Failed to get app installation token: ' + apError.message );
        return false;
    }

    const gitToken = appInstallToken.data.token;
    if ( !gitToken || gitToken.length === 0 ) {
        log( 'error', '[SUGGEST] [API] App installation token not found for account: ' + process.env.GIT_ACCT );
        return false;
    }

    Fishsticks.GIT_INSTALL_TOKEN = gitToken;
    log( 'info', '[SUGGEST] [API] App installation token generated successfully.' );

    return true;
}

//Exports
module.exports = {
    name: 'suggest',
    data,
    run,
    help,
    getAppInstallInfo
};
