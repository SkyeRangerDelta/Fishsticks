//----SUMMON----

//Imports
const { log } = require( '../../Modules/Utility/Utils_Log.js' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'summon' )
    .setDescription( 'Summons cards!' )
    .addStringOption( o => o
        .setName( 'card-name' )
        .setDescription( 'The name of the card to summon.' )
        .setRequired( true )
    );


//Functions
async function run( fishsticks, int ) {
    //Set card name
    const cardName = int.options.getString( 'card-name' );

    //BrodeMode Toggle
    if ( cardName === 'brodemode' ) {
        fishsticks.SUMM_BRODEMODE = !fishsticks.SUMM_BRODEMODE;

        if ( fishsticks.SUMM_BRODEMODE ) {
            return int.reply( 'Brodemode is now on! Play by the rules or get out of my server.' );
        }
        else {
            return int.reply( 'Brodemode is now off! *Brode Laughter* Ben drowned on his own spit laughing.' );
        }
    }

    log( 'info', '[SUMMON] Attempting to summon a card.' );

    /*
    --> Not implemented yet.

    const restrictedCards = [
        'shaddodgeling',
        'futronbobs scheme',
        'enhance',
        'snek',
        'the door'
    ]; //List of "subcards" and/or other cards that cannot be simply played

    */

    try { //Attempt to summon/execute
        if ( fishsticks.SUMM_BRODEMODE === false ) {
            await int.reply( { files: [{
                    attachment: `./Commands/Active/Summons/${cardName}.png`
                }] } );
        }
    }
    catch ( summonErr ) {
        log( 'info', '[SUMMON] Summon Err\n' + summonErr );
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'summon', 'the target spell wasn\'t able to be cast.' ) }`, ephemeral: true } ); //Friendly response on failure
    }
}

function help() {
    return 'Summons cards!';
}

//Exports
module.exports = {
    name: 'summon',
    data,
    run,
    help
};