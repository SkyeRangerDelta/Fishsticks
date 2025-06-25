// ---- Echo ----
//Posts an ping on a delayed timer in Announcements

const { hasPerms } = require( '../../Modules/Utility/Utils_User' );
const { findRole } = require( './role' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

let annChannel;

//Globals
const data = new SlashCommandBuilder()
    .setName( 'echo' )
    .setDescription( 'Posts a delayed announcement' );

data.addNumberOption( o => o
    .setName( 'wait-time' )
    .setDescription( 'The time to wait in minutes before posting the announcement.' )
    .setRequired( true ) );

data.addStringOption( o => o
    .setName( 'announcement' )
    .setDescription( 'The announcement to post.' )
    .setRequired( true ) );

data.addRoleOption( o => o
    .setName( 'role-ping' )
    .setDescription( 'What game role should be pinged? (ONLY WORKS FOR GAME ROLES)' ) );

data.addStringOption( o => o
    .setName( 'ping-type' )
    .setDescription( 'If pinging a role, name that role by name or game (as seen in !roles), pick a choice otherwise.' )
    .addChoices(
        {
            name: 'everyone',
            value: 'everyone'
        },
        {
            name: 'here',
            value: 'here'
        },
        {
            name: 'soft',
            value: 'soft'
        }
    )
);

//Functions
async function run( fishsticks, int ) {
    annChannel = await fishsticks.channels.cache.get( fishsticks.ENTITIES.Channels[ 'announcements' ] );

    if ( !hasPerms( int.member, ['Event Coordinator', 'Moderator', 'Council Member', 'Council Advisor'] ) ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'echo', 'the user did not have permission to run the command' ) }`, ephemeral: true } );
    }

    //Syntax: echo wait-time role-ping(?) ping-type(?) announcement

    if ( !int.options.getString( 'announcement' ) ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'echo', 'the message content was empty.' ) }`, ephemeral: true } );
    }

    let waitTime = int.options.getNumber( 'wait-time' );
    if ( waitTime <= 0 ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'echo', 'the wait-time before posting a delayed message was empty or not a number.' ) }`, ephemeral: true } );
    }
    else {
        waitTime = waitTime * 60 * 1000;
    }

    if ( !int.options.getRole( 'role-ping' ) && !int.options.getString( 'ping-type' ) ) {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'echo', 'the announcement ping type was wrong.' ) }`, ephemeral: true } );
    }
    else if ( !int.options.getString( 'ping-type' ) ) {
        //Check role
        const role = int.options.getRole( 'role-ping' );
        const roleObj = await findRole( fishsticks, role.name );

        if ( !roleObj || roleObj === -1 ) {
            return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'echo', 'game role that was pinged was wrong.' ) }`, ephemeral: true } );
        }
        else {
            int.reply( { content: 'Timeout set, waiting ' + int.options.getNumber( 'wait-time' ) + ' minutes before deploying.', ephemeral: true } );
            setTimeout( dispatchMsg, waitTime, role + ', ' + int.options.getString( 'announcement' ) );
        }
    }
    else if ( !int.options.getRole( 'role-ping' ) ) {
        //Check ping type (ensure a choice selection)
        const pingType = int.options.getString( 'ping-type' );
        if ( pingType === 'here' || pingType === 'everyone' ) {
            int.reply( { content: 'Timeout set, waiting ' + int.options.getNumber( 'wait-time' ) + ' minutes before deploying.', ephemeral: true } );
            setTimeout( dispatchMsg, waitTime, `@${pingType}, ` + int.options.getString( 'announcement' ) );
        }
        else if ( pingType === 'soft' ) {
            int.reply( { content: 'Timeout set, waiting ' + int.options.getNumber( 'wait-time' ) + ' minutes before deploying.', ephemeral: true } );
            setTimeout( dispatchMsg, waitTime, int.options.getString( 'announcement' ) );
        }
        else {
            return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'echo', 'the ping type for the announcement was wrong.' ) }`, ephemeral: true } );
        }
    }
    else {
        return int.reply( { content: `${ await getErrorResponse( int.client.user.displayName, 'echo', 'something went wrong we\'re not quite sure of.' ) }`, ephemeral: true } );
    }
}

function help() {
    return 'Posts a delayed announcement.';
}

function dispatchMsg( msg ) {
    annChannel.send( { content: msg } );
}

//Exports
module.exports = {
    name: 'echo',
    data,
    run,
    help
};