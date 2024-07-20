//----VOUCH----
//Vote for a user to join the community.

//Imports
const { recognized } = require( '../../Modules/Core/Core_ids.json' );
const { handleNewMember } = require( '../../Modules/Core/Core_NewMember' );
const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { log } = require( '../../Modules/Utility/Utils_Log' );
const { hasPerms } = require( '../../Modules/Utility/Utils_User' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );

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
        return int.reply( { content: 'You dont have permission to vouch people in!', ephemeral: true } );
    }

    //Get role
    recognizedRole = await int.guild.roles.fetch( recognized );

    //Interpret vouch
    const vouchee = int.options.getMember( 'vouchee' );
    const referral = int.options.getBoolean( 'referral' );

    if ( vouchee.id === fishsticks.user.id ) {
        //Prevent Fs vouches
        log( 'info', `[VOUCH] ${int.member.displayName} tried to vouch Fishsticks in.` );
        return int.reply( { content: '*Shakes head* No. This is not how that works.', ephemeral: true } );
    }
    else if ( vouchee.id === int.member.id ) {
        //Prevent self-vouching
        log( 'info', `[VOUCH] ${int.member.displayName} tried to vouch themselves in.` );
        return int.reply( { content: '*No*. Duh. You cannot vouch for yourself.', ephemeral: true } );
    }
    else if ( hasPerms( vouchee, ['Recognized', 'CC Member', 'ACC Member'] ) ) {
        //Prevent membership vouches
        log( 'info', `[VOUCH] ${int.member.displayName} tried to vouch someone who didn't need it in.` );
        return int.reply( { content: `Why...why? ${vouchee.displayName} definitely doesn't need it.`, ephemeral: true } );
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
        return int.reply( { content: `I can't do that until ${vouchee.displayName} has a valid FSO record. Get them to say something in chat.`, ephemeral: true } );
    }

    //Do FSO checks/validation then add
    const memberVouches = vouchQuery.vouches;

    if( memberVouches.includes( int.member.id ) ) {
        return await int.reply( { content: `You've already vouched for ${vouchee.displayName}!`, ephemeral: true } );
    }

    if ( memberVouches.length < 2 ) {
        //clear, do vouch
        await addVouch( fishsticks, int, vouchQuery, referral );
    }
    else {
        //Not clear
        return int.reply( { content: 'This person has already reached 2 vouches! If they are lacking Recognized despite this, ping Skye.', ephemeral: true } );
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
            return int.reply( { content: 'Mmmmmmmm, something is wrong and the vouch may have not been tallied correctly.', ephemeral: true } );
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
            return int.reply( { content: 'Mmmmmmmm, something is wrong and the vouch may have not been tallied correctly.', ephemeral: true } );
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