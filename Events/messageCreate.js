// ---- MESSAGE EVENT ----

//Imports
const { processMessage } = require( '../Modules/Core/Core_Message' );
const { bcId } = require( '../Modules/Core/Core_ids.json' );

//Export
module.exports = {
    name: 'messageCreate',
    execute
};

async function execute( fishsticks, msg ) {
    if ( msg.author === fishsticks.user ) return;
    if ( msg.author.bot && msg.author.id !== bcId ) return;

    processMessage( fishsticks, msg );
}