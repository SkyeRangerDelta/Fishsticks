// ==== Poem ====
//---------------
//Does things related to poetry

//Imports
const https = require( 'https' );
const { log } = require( '../../Modules/Utility/Utils_Log' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { EmbedBuilder } = require( 'discord.js' );
const poemEntropyArray = require( '../../Modules/Library/poemEntropy.json' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'poem' )
    .setDescription( 'Prints poems' );

data.addSubcommand( s => s
    .setName( 'random' )
    .setDescription( 'Prints a random poem.' ) );

data.addSubcommand( s => s
    .setName( 'search-author' )
    .setDescription( 'Searches for a poem by author.' )
    .addStringOption( o => o
        .setName( 'author' )
        .setDescription( 'The author to search by.' )
        .setRequired( true ) )
  .addStringOption( o => o
        .setName( 'term' )
        .setDescription( 'The term to search by.' )
        .setRequired( true ) ) );

data.addSubcommand( s => s
  .setName( 'search-title' )
  .setDescription( 'Searches for a poem by name.' )
  .addStringOption( o => o
    .setName( 'title' )
    .setDescription( 'The author to search by.' )
    .setRequired( true ) ) );

const API_USER = process.env.STANDS4_USER;
const API_KEY = process.env.STANDS4_KEY;

if ( !API_USER || !API_KEY ) {
    log( 'error', '[POEM] [API] API credentials not found!' );
    throw new Error( '[POEM] [API] API credentials not found!' );
}

const API_URL = `https://www.stands4.com/services/v2/poetry.php?uid=${API_USER}&tokenid=${API_KEY}`;

//Functions
async function run( fishsticks, int ) {
    const subCMD = int.options.getSubcommand();

    if ( subCMD === 'random' ) {
        await buildPoem( int );
    }
    else if ( subCMD === 'search-author' ) {
        const author = int.options.getString( 'author' );
        const term = int.options.getString( 'term' );

        await searchPoemAuthor( author, term, int );
    }
    else if ( subCMD === 'search-title' ) {
        const title = int.options.getString( 'title' );

        await searchPoemTitle( title, int );

    }
}

async function fetchPoemResults() {
    let poemObj = '';
    const poemEntropyIndex = Math.floor( Math.random() * poemEntropyArray.length );
    const poemEntropy = poemEntropyArray[poemEntropyIndex];
    const payloadURL = `${API_URL}&term=${poemEntropy}&format=json`;

    return new Promise( function( resolve, reject ) {
        https.get( payloadURL, ( done ) => {

            log( 'info', '[POEM] [RANDOM] Status: ' + done.statusCode );

            done.on( 'data', ( content ) => {
                poemObj += content;
            } );

            done.on( 'end', function() {
                resolve( JSON.parse( poemObj ) );
            } );

            done.on( 'error', err => {
                reject( err );
            } );
        } );
    } );
}

async function searchPoemAuthor( author, term, int ) {
    const payloadURL = `${API_URL}author,title/${author};${term}`;

    console.log( payloadURL );

    let poemObj = '';

    return new Promise( function( resolve, reject ) {
        https.get( payloadURL, ( done ) => {

            log( 'info', '[POEM] [SEARCH] Status: ' + done.statusCode );

            done.on( 'data', ( content ) => {
                poemObj += content;
            } );

            done.on( 'end', function() {
                const poemData = JSON.parse( poemObj );

                if ( poemData.status === 404 ) {
                    return int.reply( { content: 'No poems found!' } );
                }

                console.log( poemData );

                const poemTxt = poemData[0].lines.join( '\n' );
                const poemEmbed = new EmbedBuilder()
                    .setTitle( `*${poemData[0].title}* - ${poemData[0].author}` )
                    .setDescription( `${poemTxt}` )
                    .setFooter( {
                        text: 'API provided by PoetryDB.'
                    } );

                return int.reply( { embeds: [poemEmbed] } );
            } );

            done.on( 'error', err => {
                reject( err );
            } );
        } );
    } );
}

async function searchPoemTitle( title, int ) {
    const payloadURL = `${API_URL}title/${title}`;

    let poemObj = '';

    return new Promise( function( resolve, reject ) {
        https.get( payloadURL, ( done ) => {

            log( 'info', '[POEM] [SEARCH] Status: ' + done.statusCode );

            done.on( 'data', ( content ) => {
                poemObj += content;
            } );

            done.on( 'end', function() {
                const poemData = JSON.parse( poemObj );

                if ( poemData.status === 404 ) {
                    return int.reply( { content: 'No poems found!' } );
                }

                console.log( poemData );

                const poemTxt = poemData[0].lines.join( '\n' );
                const poemEmbed = new EmbedBuilder()
                  .setTitle( `*${poemData[0].title}* - ${poemData[0].author}` )
                  .setDescription( `${poemTxt}` )
                  .setFooter( {
                      text: 'API provided by PoetryDB.'
                  } );

                return int.reply( { embeds: [poemEmbed] } );
            } );

            done.on( 'error', err => {
                reject( err );
            } );
        } );
    } );
}

async function buildPoem( int ) {
    let poemObj, poemRes;
    let poemTxt = '';

    for ( let l = 1; l < 6; l++ ) {
        log( 'info', `[POEM] (${l}) Obtaining a suitable poem.` );
        poemRes = await fetchPoemResults();

        console.log( poemRes.result );

        const resultIndex = Math.floor( Math.random() * poemRes.result.length );
        poemObj = poemRes.result[resultIndex];

        poemTxt = poemObj.poem;

        if ( poemTxt.length < 2048 ) {
            log( 'info', '[POEM] [RANDOM] Selected poem: ' + poemObj.title );
            break;
        }
    }

    if ( poemTxt.length > 2048 ) {
        if ( int ) {
            return int.reply( 'Failed to find a suitable poem (in a few tries).' );
        }
        else {
            return log( 'info', 'Failed to find a suitable poem (in a few tries).' );
        }
    }

    if ( poemTxt === '' ) {
        if ( int ) {
            return int.reply( { content: 'I messed up somewhere, try again?' } );
        }
        else {
            return log( 'info', 'Selected poem was wrong.' );
        }
    }

    const poemEmbed = new EmbedBuilder()
        .setTitle( `*${poemObj.title}* - ${poemObj.poet}` )
        .setDescription( `${poemTxt}` )
        .setFooter( {
            text: 'API provided by the STANDS4 Poetry API.'
        } );

    if ( !int ) { //doDailyPost
        return poemEmbed;
    }

    return int.reply( { embeds: [poemEmbed] } );
}

function help() {
    return 'Prints poems.';
}

//Exports
module.exports = {
    name: 'poem',
    data,
    run,
    help,
    buildPoem
};