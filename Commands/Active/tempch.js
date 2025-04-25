// ---- Temp CH ----
// Creates temporary voice channels

//Imports

const { log } = require( '../../Modules/Utility/Utils_Log' );
const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { hasPerms } = require( '../../Modules/Utility/Utils_User' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { ChannelType } = require( 'discord-api-types/v9' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'tempch' )
    .setDescription( 'Creates temporary voice channels.' );

data.addStringOption( o => o.setName( 'channel-name' ).setDescription( 'The name of the channel.' ).setRequired( true ) );
data.addIntegerOption( o => o.setName( 'max-users' ).setDescription( 'How many voice connections to limit this chat to.' ) );

//Functions
async function run( Fishsticks, int ) {
    int.deferReply( { ephemeral: true } );

    if( !hasPerms( int.member, ['CC Member', 'ACC Member', 'Event Coordinator'] ) ) {
        return int.editReply( { content: 'Only (A)CC Members can create temporary channels!', ephemeral: true } );
    }

    //Check voice state
    if ( !int.member.voice.channel || int.member.voice.channel.id !== chSpawner ) {
        return int.editReply( { content: 'You must connect to the channel spawner first!', ephemeral: true } );
    }

    await createCh( Fishsticks, int );
}

function help() {
    return 'Creates a temporary voice channel.';
}

//Creates a temp channel
async function createCh( Fishsticks, int ) {

    const chSpawnerChannel = int.guild.channels.cache.get( chSpawner );
    const maxUsers = int.options.getInteger( 'max-users' );
    const chName = int.options.getString( 'channel-name' );

    //No Limit
    if ( isNaN( maxUsers ) || !maxUsers ) {
        log( 'info', '[TEMP-CH] Temp channel has no maxUser limit.' );

        const chData = {
            name: `${chName}`,
            type: ChannelType.GuildVoice,
            reason: '[TEMP-CH] System channel creation.',
            position: chSpawnerChannel.rawPosition + 1
        };

        await chSpawnerChannel.clone( chData ).then( async ( clonedCh ) => {
            await int.member.voice.setChannel( clonedCh );

            await fso_query( Fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'insert', { id: clonedCh.id, name: chName } );

            return int.editReply( {
                content: 'Done!',
                ephemeral: true
            } );
        } );
    }
    else { //Has limit
        log( 'info', '[TEMP-CH] Creating a new channel with a user limit.' );

        const chData = {
            name: `${chName}`,
            type: ChannelType.GuildVoice,
            userLimit: maxUsers,
            reason: '[TEMP-CH] System channel creation.',
            position: chSpawnerChannel.rawPosition + 1
        };

        await chSpawnerChannel.clone( chData ).then( async ( clonedCh ) => {
            await int.member.voice.setChannel( clonedCh );

            await fso_query( Fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'insert', { id: clonedCh.id, name: chName } );

            return int.editReply( {
                content: 'Done!',
                ephemeral: true
            } );
        } );
    }
}

//Check exit channel
async function validateChannel( fishsticks, preMemberState ) {
    //Get channels
    const oldMemberChannel = preMemberState.channel;

    if ( oldMemberChannel.members.size === 0 ) {

        const chRes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'select', { id: oldMemberChannel.id } );
        if ( !chRes ) return;

        log( 'info', '[TEMP-CH] Channel slated for deletion (no users).' );
        await delCh( fishsticks, oldMemberChannel );
    }

}

//Deletes a temp channel
async function delCh( fishsticks, oldMemberChannel ) {

    const chRes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'delete', { id: oldMemberChannel.id } );

    if ( chRes.deletedCount !== 1 ) {
        fishsticks.CONSOLE.send( fishsticks.RANGER + ', FSO failed to properly delete a channel - or possibly something more sinister.' );
    }
    else {
        await oldMemberChannel.delete( 'FS TempCh trash collection.' ).then( ch => {
            log( 'proc', '[TEMP-CH] Channel "' + ch.name + '" deleted.' );
        } );
    }
}

//Exports
module.exports = {
    name: 'tempch',
    data,
    run,
    help,
    validateChannel
};