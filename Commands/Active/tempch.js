// ---- Temp CH ----
// Creates temporary voice channels

//Imports
const { chSpawner } = require('../../Modules/Core/Core_ids.json');

const { log } = require('../../Modules/Utility/Utils_Log');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');

//Exports
module.exports = {
    run,
    help,
    validateChannel
};

//Functions
async function run(Fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    const guild = cmd.msg.guild;

    //Syntax: !tempch -<maxUsers> -[channelName]
    if (!cmd.content[0] || cmd.content[0] == null || cmd.content[0] == undefined) {
        return cmd.msg.reply('Why are you the way that you are. Give me something to work with here.').then(sent => sent.delete({ timeout: 10000 }));
    }

    //Check voice state
    if (!cmd.msg.member.voice.channelID || cmd.msg.member.voice.channelID != chSpawner) {
        return cmd.msg.reply('You must connect to the channel spawner first!');
    }

    createCh(Fishsticks, cmd, guild);
}

function help() {
    return 'Creates a temporary voice channel.';
}

//Creates a temp channel
async function createCh(Fishsticks, cmd, guild) {

    const chSpawnerChannel = guild.channels.cache.get(chSpawner);
    const maxUsers = parseInt(cmd.content[0]);

    //No Limit
    if (isNaN(maxUsers) || typeof maxUsers != typeof 0) {
        log('info', '[TEMP-CH] Temp channel has no maxUser limit.');

        const chName = toTitleCase(cmd.content[0]);

        const chData = {
            name: chName,
            type: 'voice'
        };

        await chSpawnerChannel.clone(chData).then(async newCh => {
            cmd.msg.member.voice.setChannel(newCh);
            fso_query(Fishsticks.FSO_CONNECTION, 'Fs_TempCh', 'insert', { id: newCh.id, name: chName });
        });
    }
    else { //Has limit
        log('info', '[TEMP-CH] Creating a new channel with no user limit.');

        const chName = toTitleCase(cmd.content[1]);

        const chData = {
            name: chName,
            type: 'voice',
            userLimit: maxUsers
        };

        await chSpawnerChannel.clone(chData).then(async newCh => {
            cmd.msg.member.voice.setChannel(newCh);
            await fso_query(Fishsticks.FSO_CONNECTION, 'Fs_TempCh', 'insert', { id: newCh.id, name: chName });
        });
    }
}

//Check exit channel
async function validateChannel(fishsticks, preMemberState) {
    //Get channels
    const oldMemberChannel = preMemberState.channel;

    if (oldMemberChannel.members.size === 0) {

        const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_TempCh', 'select', oldMemberChannel.id);
        if (!chRes || chRes == null) return;

        log('info', '[TEMP-CH] Channel slated for deletion (no users).');
        delCh(fishsticks, oldMemberChannel);
    }

}

//Deletes a temp channel
async function delCh(fishsticks, oldMemberChannel) {

    await oldMemberChannel.delete('FS TempCh trash collection.').then(ch => {
        log('proc', '[TEMP-CH] Channel "' + ch.name + '" deleted.');
    });

    const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_TempCh', 'delete', oldMemberChannel.id);

    if (chRes.deleted != 1) {
        fishsticks.CONSOLE.send(fishsticks.RANGER + ', FSO failed to properly delete a channel - or possibly something more sinister.');
    }
}