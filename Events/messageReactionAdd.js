// ---- MESSAGE REACTION ADD EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');
const { validateAddedReaction } = require('../Modules/Utility/Utils_Aux');

//Export
module.exports = {
    name: 'messageReactionAdd',
    execute
};

async function execute(fishsticks, addedReaction, reactor) {
    log('info', `[CLIENT] Reaction Add - ${addedReaction.emoji} : ${reactor.username}`);

    await validateAddedReaction(fishsticks, addedReaction, reactor);
}