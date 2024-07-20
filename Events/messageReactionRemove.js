// ---- MESSAGE REACTION REMOVE EVENT ----

//Imports
const { log } = require( '../Modules/Utility/Utils_Log' );

//Export
module.exports = {
    name: 'messageReactionRemove',
    execute
};

async function execute( fishsticks, removedReaction, reactor ) {
    log( 'info', `[CLIENT] Reaction Remove - ${removedReaction.emoji} : ${reactor.username}` );
}