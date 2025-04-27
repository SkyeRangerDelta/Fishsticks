// ---- Message Handler ----
//===========================
//Handles message events

//Imports
const { log } = require( '../Utility/Utils_Log' );
const { fso_validate, hasPerms } = require( '../Utility/Utils_User' );
const { fso_query } = require( '../FSO/FSO_Utils' );
const { handleDenMsg } = require( '../Utility/Utils_Aux' );
const { processXP } = require( '../XP/XP_Core' );
const { handleShiny } = require( '../Utility/Utils_Shiny' );

//Exports
module.exports = {
    processMessage,
    generateRandomQuote
};

//Functions
async function processMessage( Fishsticks, msg ) {

    const prefix = Fishsticks.CONFIG.prefix;

    // Breadcrumbs stuff
    // Check for messages in relay
    if ( msg.channel.id === Fishsticks.ENTITIES.Channels['minecraft-relay'] && msg.author.id === Fishsticks.ENTITIES.Users['Breadcrumbs'] && msg.embeds.length > 0 ) {
        // Get Relay channel
        const relayChannel = Fishsticks.channels.cache.get( Fishsticks.ENTITIES.Channels['minecraft-relay'] );

        // Check content for died
        console.log( 'Relay message', msg.embeds[0].author.name );
        const dm = msg.embeds[0].author.name.toLowerCase();
        const deathKeywords = [
            'died',
            'dead',
            'death',
            'killed',
            'drowned',
            'burned',
            'suffocated',
            'walked into',
            'fell from',
            'blew up',
            'fell into',
            'starved',
            'impaled',
            'shot',
            'blown up',
            'squished',
            'squashed',
            'pummeled',
            'stabbed',
            'fireballed',
            'experienced kinetic energy',
            'hit the ground too hard',
            'fell off',
            'fell out of the world',
            'fell while',
            'was doomed',
            'went up,',
            'burned',
            'went off',
            'slain',
            'struck',
            'floor was lava',
            'swim in lava',
            'walked into',
            'stung',
            'obliterated',
            'left the confines',
            'poked',
            'want to live',
            'fell too,',
            'too soft'
        ];

        const deathCheck = deathKeywords.some( word => dm.includes( word ) );
        if ( deathCheck ) {
            console.log( 'Death message' );
            relayChannel.send( { content: 'F' } );
        }

        return;
    }

    // Stop Breadcrumbs XP / other interactions
    if ( msg.author.bot ) return;

    // --- Pre Message Core ---

    //Member validation
    await fso_validate( Fishsticks, msg );

    //Handler
    const cmdBreakup = msg.content.toLowerCase().substring( 1, msg.content.length ).split( '-' );
    const cmd = {
        ID: cmdBreakup.shift().trim(),
        content: [],
        msg: msg,
        channel: msg.channel,
        reply: function( resp, delTime ) {
            msg.channel.send( `${msg.member}, ${resp}` )
                .then( s => {
                    if ( delTime ) {
                        setTimeout( () => s.delete(), delTime * 1000 );
                    }
                } );
        }
    };

    //Trim content
    for ( const param in cmdBreakup ) {
        cmd.content.push( cmdBreakup[param].trim() );
    }

    // --- Aux Functions ---

    //Check BaconMode
    if ( msg.author.id === Fishsticks.baconTarget ) {
        await msg.react( '🥓' );
    }

    //Check Debater
    if ( msg.channel.id === Fishsticks.ENTITIES.Channels['discussion-den'] ) {
        await handleDenMsg( cmd, Fishsticks );
    }

    //Determine 'Shiny'
    //Discord API does not let message to be rendered in any other way
    //TODO: Canvas?

    // --- Message Core ---

    //Do XP
    await processXP( Fishsticks, cmd );

    //Do Random Quote
    await processQuote( Fishsticks, cmd );

    //Message handling
    if ( !msg.content.startsWith( prefix ) ) {
        //Passive Command Handler
        const passiveID = msg.content.trim().toLowerCase().split( ' ' )[0];
        try {
            const passiveCmd = require( `../../Commands/Passive/${passiveID}.js` );

            if ( cmd.channel.id === prReqs ) return;

            passiveCmd.run( Fishsticks, cmd );
        }
        catch ( passiveCmdErr ) {
            log( 'info', '[PASSIVE-CMD] Attempt failed.' );
        }
        finally {
            // Sort The Nod
            const twitchURL = 'https://twitch.tv/';
            if ( findURL( twitchURL, msg.content ) ) {
                if ( !hasPerms( cmd.msg.member, ['The Nod'] ) && !hasPerms( cmd.msg.member, ['Moderator', 'Council Member', 'Council Advisor'] ) ) {
                    cmd.reply( 'You need the nod to post Twitch links!' );
                }
            }

            // if (cmd.msg.content.includes('https://twitch.tv/')) {
            //     if (!hasPerms(cmd.msg.member, ['The Nod']) && !hasPerms(cmd.msg.member, ['Moderator', 'Council Member', 'Council Advisor'])) {
            //         cmd.reply('You need the nod to post Twitch links!');
            //     }
            // }

            //Shiny?
            const number = Math.random() * ( 8192 - 1 ) + 1;
            if ( number === 5 && msg.content.length <= 70 ) {
                await handleShiny( msg );
            }

            //Karen Mode
            const pMsg = cmd.msg.content.toLowerCase();
            if ( ( pMsg.includes( 'speak to your manager' ) ) && ( pMsg.includes( 'fishsticks' ) ) ) {
                cmd.channel.send( { content: `${Fishsticks.RANGER}, some nark wants to talk to you.` } );
            }
        }
    }
}

//Process the random quote logic
async function processQuote( fishsticks, cmd ) {
    const quoteCheck = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_Status', 'select', { id: 1 } );
    const tick = quoteCheck.rMsgTick;

    if ( !quoteCheck ) throw 'Didnt receive an FSO response!';

    if ( tick === 0 || !tick || isNaN( tick ) ) {
        log( 'info', '[R-QUOTE] Tick was on DB check, resetting...' );
        const newTickNum = newTick();

        return await updateQuoteTick( fishsticks, newTickNum );
    }

    if ( ( tick - 1 ) === 0 ) {
        const newTickNum = newTick();
        await generateRandomQuote( fishsticks, cmd );

        await updateQuoteTick( fishsticks, newTickNum );
    }
    else {
        await updateQuoteTick( fishsticks, ( tick - 1 ) );
    }
}

//Update status
async function updateQuoteTick( fishsticks, tickNum ) {
    const rMsgStatus = {
        $set: {
            rMsgTick: tickNum
        }
    };

    const updateRes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', rMsgStatus, { id: 1 } );

    //Validate
    if ( updateRes.modifiedCount !== 1 ) {
        log( 'warn', '[R-QUOTE] Tick update failed.' );
    }
    else {
        log( 'proc', '[R-QUOTE] Tick update done.' );
    }
}

//Generate the random quote and return
async function generateRandomQuote( fishsticks, int ) {
    const quotes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'selectAll' );

    const quoteIndex = Math.floor( Math.random() * quotes.length );
    log( 'proc', `[R-QUOTE] New quote fired. Index ${quoteIndex}.` );

    //Send it
    int.channel.send( `${quotes[quoteIndex].q}` );
}

//Generate a new tick count
function newTick() {
    return Math.round( Math.random() * ( 1000 - 25 ) + 25 );
}

// Find a matching URL
function findURL( url, str ) {
    const escapedUrl = sanitize( url );
    const pattern = new RegExp( escapedUrl, 'i' );

    return pattern.test( str );
}

function sanitize( str ) {
    return str.replace( /[-/\\^$*+?.()|[\]{}]/g, '\\$&' );
}