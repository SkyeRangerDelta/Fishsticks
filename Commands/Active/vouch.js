//----VOUCH----
//Vote for a user to join the community.

//Imports
const { handleNewMember } = require( '../../Modules/Core/Core_NewMember' );
const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { log } = require( '../../Modules/Utility/Utils_Log' );
const { hasPerms } = require( '../../Modules/Utility/Utils_User' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'vouch' )
    .setDescription( 'Vouches for a newcomer.' );

data.addUserOption( o => o.setName( 'vouchee' ).setDescription( 'The person to vouch for.' ).setRequired( true ) );
data.addBooleanOption( o => o.setName( 'referral' ).setDescription( 'Is this person a referral? (Fast track?)' ) );

let recognizedRole;

//Functions
async function run( fishsticks, int ) {
    //Ensure perms
    if ( !hasPerms( int.member, ['Moderator', 'Council Member', 'Council Advisor'] ) ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', 'the user doesn\'t have permission to vouch people in.' ) }`, ephemeral: true } );
    }

    //Get role
    recognizedRole = await int.guild.roles.fetch( fishsticks.ENTITIES.Roles[ 'Recognized' ] );

    //Interpret vouch
    const vouchee = int.options.getMember( 'vouchee' );
    const referral = int.options.getBoolean( 'referral' );

    if ( vouchee.id === fishsticks.user.id ) {
        //Prevent Fs vouches
        log( 'info', `[VOUCH] ${int.member.displayName} tried to vouch Fishsticks in.` );
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', 'the user tried to vouch Fishsticks in.' ) }`, ephemeral: true } );
    }
    else if ( vouchee.id === int.member.id ) {
        //Prevent self-vouching
        log( 'info', `[VOUCH] ${int.member.displayName} tried to vouch themselves in.` );
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', 'the user tried to vouch for themselves.' ) }`, ephemeral: true } );
    }
    else if ( hasPerms( vouchee, ['Recognized', 'CC Member', 'ACC Member'] ) ) {
        //Prevent membership vouches
        log( 'info', `[VOUCH] ${int.member.displayName} tried to vouch someone who didn't need it in.` );
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', `the vouchee (${ vouchee.displayName }) had already been vouched into the server.` ) }`, ephemeral: true } );
    }

    if ( !vouchee ) {
        log( 'info', `[VOUCH] ${vouchee} is an invalid vouchee.` );
        throw 'I could not find the member to vouch for!';
    }

    //Interact with FSO table
    log( 'info', '[VOUCH] Pending vouch record...' );
    const vouchQuery = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: vouchee.id } );

    if ( !vouchQuery ) {
        log( 'info', '[VOUCH] Failed to collect vouchee record!' );
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', `the command errored because ${ vouchee.displayName } needs to say something in the chat first.` ) }`, ephemeral: true } );
    }

    //Do FSO checks/validation then add
    const memberVouches = vouchQuery.vouches;

    if( memberVouches.includes( int.member.id ) ) {
        return await int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', `the failed because the user had already vouched for ${ vouchee.displayName }.` ) }`, ephemeral: true } );
    }

    if ( memberVouches.length < 2 ) {
        //clear, do vouch
        await addVouch( fishsticks, int, vouchQuery, referral );
    }
    else {
        //Not clear
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', `${ vouchee.displayName } had already been vouched in - they should check with a moderator to assign the role if need be.` ) }`, ephemeral: true } );
    }

}

async function addVouch( fishsticks, int, memberFSORecord, ref ) {

    if ( ( memberFSORecord.vouches.length === 1 ) || ref ) {
        if ( ref ) log( 'info', '[VOUCH] Incoming referral, instant add Recognized.' );
        //1 vouch on record OR referred, update and add Recognized
        const recordUpdate = {
            $push: {
                vouches: int.member.id
            },
            $set: {
                vouchedIn: 'Yes'
            }
        };

        const addVouchRes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', recordUpdate, { id: memberFSORecord.id } );
        const vouchee = await int.guild.members.cache.get( memberFSORecord.id );
        await vouchee.roles.add( recognizedRole, '[VOUCH] Granted recognized on due to reaching 2 vouches.' );

        if ( addVouchRes.modifiedCount === 1 ) {
            await int.channel.send( { content: `${memberFSORecord.username} has been vouched for and has been granted Recognized!` } );
            await int.reply( {
                content: 'Done!',
                ephemeral: true
            } );
            return handleNewMember( fishsticks, vouchee ); //Handle member welcome graphic
        }
        else {
            return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', 'something unknown went wrong processing the vouch.' ) }`, ephemeral: true } );
        }
    }
    else {
        //None on record, add new record
        const recordUpdate = {
            $push: {
                vouches: int.member.id
            }
        };

        const addVouchRes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', recordUpdate, { id: memberFSORecord.id } );

        if ( addVouchRes.modifiedCount === 1 ) {
            return int.reply( { content: `${memberFSORecord.username} has been vouched for and needs only one more vouch.`, ephemeral: true } );
        }
        else {
            return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'vouch', 'something unknown went wrong processing the vouch.' ) }`, ephemeral: true } );
        }
    }
}

function help() {
    return 'Vouches a user into the community from the Crash Pad.';
}

//Exports
module.exports = {
    name: 'vouch',
    data,
    run,
    help
};