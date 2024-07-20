// ---- VOICE STATE UPDATE EVENT ----

//Imports
const { log } = require( '../Modules/Utility/Utils_Log' );
const { validateChannel } = require( '../Commands/Active/tempch' );

//Export
module.exports = {
    name: 'voiceStateUpdate',
    execute
};

async function execute( fishsticks, prevMemberState, newMemberState ) {

    if ( !newMemberState.channel ) {
        log( 'info', `[CLIENT] [VC STATE] ${prevMemberState.member.displayName} disconnected from ${prevMemberState.channel.id}` );
    }
    else if ( !prevMemberState.channel ) {
        log( 'info', `[CLIENT] [VC STATE] ${prevMemberState.member.displayName} joined ${newMemberState.channel.id}` );
    }
    else {
        log( 'info', `[CLIENT] [VC STATE] ${prevMemberState.member.displayName} disconnected from ${prevMemberState.channel.id} and joined ${newMemberState.channel.id}` );
    }

    //Trigger tempch check
    if ( prevMemberState.channel != null ) {
        await validateChannel( fishsticks, prevMemberState );
    }
}