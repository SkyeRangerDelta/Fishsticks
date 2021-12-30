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
    if (!currChannel) {
        return cmd.reply('But...youre not in a voice channel. Why?', 10);
    }

    const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'select', { id: currChannel.id });
    if (!chRes) {
        return cmd.reply('Thats not a temp channel.', 10);
    }

    //Syntax: !tempname -[channelName]
    const newTitle = toTitleCase(cmd.content[0]);

    if (!newTitle) {
        return cmd.reply('You know, you only hurt yourself when you do this. I need the new channel name in order to change the current one.', 10);
    }

    await currChannel.setName(newTitle).then(async editCh => {
        log('info', '[TEMP-NAME] Channel name changed to ' + newTitle);
        await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'update', { $set: { name: newTitle } }, { id: editCh.id });
    });
}

function help() {
    return 'Changes the name of a temporary channel.';
}