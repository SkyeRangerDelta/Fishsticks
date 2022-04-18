// ---- Temp CH ----
// Creates temporary voice channels

//Imports
const { chSpawner } = require('../../Modules/Core/Core_ids.json');

const { log } = require('../../Modules/Utility/Utils_Log');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('tempch')
    .setDescription('Creates temporary voice channels.');

data.addStringOption(o => o.setName('channel-name').setDescription('The name of the channel.').setRequired(true));
data.addIntegerOption(o => o.setName('max-users').setDescription('How many voice connections to limit this chat to.'));

//Functions
async function run(Fishsticks, int) {
    if(!hasPerms(int.member, ['CC Member', 'ACC Member'])) {
        return int.reply({ content: 'Only (A)CC Members can create temporary channels!', ephemeral: true });
    }

    //Check voice state
    if (!int.member.voice.channel || int.member.voice.channel.id !== chSpawner) {
        return int.reply({ content: 'You must connect to the channel spawner first!', ephemeral: true });
    }

    await createCh(Fishsticks, int);
}

function help() {
    return 'Creates a temporary voice channel.';
}

//Creates a temp channel
async function createCh(Fishsticks, int) {

    const chSpawnerChannel = int.guild.channels.cache.get(chSpawner);
    const maxUsers = int.getInteger('max-users');
    const chName = int.getString('channel-name');

    //No Limit
    if (isNaN(maxUsers) || !maxUsers) {
        log('info', '[TEMP-CH] Temp channel has no maxUser limit.');

        const chData = {
            name: `${chName}`,
            type: 'GUILD_VOICE',
            reason: '[TEMP-CH] System channel creation.',
            position: chSpawnerChannel.rawPosition + 1
        };

        await chSpawnerChannel.clone(chData).then(async (clonedCh) => {
            await int.member.voice.setChannel(clonedCh);

            await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'insert', { id: clonedCh.id, name: chName });
        });
    }
    else { //Has limit
        log('info', '[TEMP-CH] Creating a new channel with a user limit.');

        const chData = {
            name: `${chName}`,
            type: 'GUILD_VOICE',
            userLimit: maxUsers,
            reason: '[TEMP-CH] System channel creation.',
            position: chSpawnerChannel.rawPosition + 1
        };

        await chSpawnerChannel.clone(chData).then(async (clonedCh) => {
            await int.member.voice.setChannel(clonedCh);

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

//Exports
module.exports = {
    name: 'tempch',
    data,
    run,
    help,
    validateChannel
};