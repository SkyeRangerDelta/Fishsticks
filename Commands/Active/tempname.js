// ---- Temp Name ----
// Changes the name of a temporary channel

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    const currChannel = cmd.msg.member.voice.channel;
    if (!currChannel) return cmd.msg.reply('But...youre not in a voice channel. Why?').then(sent => sent.delete({ timeout: 10000 }));

    const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_TempCh', 'select', currChannel.id);
    if (!chRes) return cmd.msg.reply('Thats not a temp channel.').then(sent => sent.delete({ timeout: 10000 }));

    //Syntax: !tempname -<maxUsers> -[channelName]
    const maxUsers = parseInt(cmd.content[0]);

    //No Limit
    if (isNaN(maxUsers) || typeof maxUsers != typeof 0) {
        log('info', '[TEMP-CH] Renaming Temp channel has no user limit.');
        const newName = toTitleCase(cmd.content[0]);

        await currChannel.setName(newName).then(async upCh => {
            await fso_query(fishsticks.FSO_CONNECTION, 'Fs_TempCh', 'update', { id: upCh.id, name: newName });
            await upCh.setUserLimit(0);
        }).catch(console.error);
    }
    else { //Has limit
        log('info', '[TEMP-CH] Renaming a channel with user limit.');
        const newName = toTitleCase(cmd.content[1]);

        await currChannel.setName(newName).then(async upCh => {
            await fso_query(fishsticks.FSO_CONNECTION, 'Fs_TempCh', 'update', { id: upCh.id, name: newName });
            await upCh.setUserLimit(maxUsers);
        }).catch(console.error);
    }
}

function help() {
    return 'Changes the name of a temporary channel.';
}