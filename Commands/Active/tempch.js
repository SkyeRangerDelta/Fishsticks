// ---- Temp CH ----
// Creates temporary voice channels

//Imports
const { chSpawner } = require('../../Modules/Core/Core_ids.json');

const { log } = require('../../Modules/Utility/Utils_Log');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');
const { hasPerms } = require('../../Modules/Utility/Utils_User');

//Exports
module.exports = {
    run,
    help,
    validateChannel
};

//Functions
async function run(Fishsticks, cmd) {
    cmd.msg.delete();

    if(!hasPerms(cmd.msg.member, ['CC Member', 'ACC Member'])) {
        return cmd.reply('Only (A)CC Members can create temporary channels!', 10);
    }

    const guild = cmd.msg.guild;

    //Syntax: !tempch -<maxUsers> -[channelName]
    if (!cmd.content[0] || cmd.content[0] == null || cmd.content[0] === undefined) {
        return cmd.reply('Why are you the way that you are. Give me something to work with here.', 10);
    }

    //Check voice state
    if (!cmd.msg.member.voice.channel || cmd.msg.member.voice.channel.id !== chSpawner) {
        return cmd.reply('You must connect to the channel spawner first!');
    }

    await createCh(Fishsticks, cmd, guild);
}

function help() {
    return 'Creates a temporary voice channel.';
}

//Creates a temp channel
async function createCh(Fishsticks, cmd, guild) {

    const chSpawnerChannel = guild.channels.cache.get(chSpawner);
    const maxUsers = parseInt(cmd.content[0]);

    //No Limit
    if (isNaN(maxUsers)) {
        log('info', '[TEMP-CH] Temp channel has no maxUser limit.');

        const chName = toTitleCase(cmd.content[0]);

        const chData = {
            name: `${chName}`,
            type: 'GUILD_VOICE',
            reason: '[TEMP-CH] System channel creation.',
            position: chSpawnerChannel.rawPosition + 1
        };

        await chSpawnerChannel.clone(chData).then(async (clonedCh) => {
            await cmd.msg.member.voice.setChannel(clonedCh);

            await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'insert', { id: clonedCh.id, name: chName });
        });
    }
    else { //Has limit
        log('info', '[TEMP-CH] Creating a new channel with a user limit.');

        const chName = toTitleCase(cmd.content[1]);

        const chData = {
            name: `${chName}`,
            type: 'GUILD_VOICE',
            userLimit: maxUsers,
            reason: '[TEMP-CH] System channel creation.',
            position: chSpawnerChannel.rawPosition + 1
        };

        await chSpawnerChannel.clone(chData).then(async (clonedCh) => {
            await cmd.msg.member.voice.setChannel(clonedCh);

            await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'insert', { id: clonedCh.id, name: chName });
        });
    }
}

//Check exit channel
async function validateChannel(fishsticks, preMemberState) {
    //Get channels
    const oldMemberChannel = preMemberState.channel;

    if (oldMemberChannel.members.size === 0) {

        const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'select', { id: oldMemberChannel.id });
        if (!chRes) return;

        log('info', '[TEMP-CH] Channel slated for deletion (no users).');
        await delCh(fishsticks, oldMemberChannel);
    }

}

//Deletes a temp channel
async function delCh(fishsticks, oldMemberChannel) {

    const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'delete', { id: oldMemberChannel.id });

    if (chRes.deletedCount !== 1) {
        fishsticks.CONSOLE.send(fishsticks.RANGER + ', FSO failed to properly delete a channel - or possibly something more sinister.');
    }
    else {
        await oldMemberChannel.delete('FS TempCh trash collection.').then(ch => {
            log('proc', '[TEMP-CH] Channel "' + ch.name + '" deleted.');
        });
    }
}