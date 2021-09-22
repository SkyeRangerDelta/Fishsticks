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
        return cmd.msg.reply({ content: 'But...youre not in a voice channel. Why?' })
            .then(sent => sent.delete({ timeout: 10000 }));
    }

    const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'select', { id: currChannel.id });
    if (!chRes) {
        return cmd.msg.reply({ content: 'Thats not a temp channel.' })
            .then(sent => sent.delete({ timeout: 10000 }));
    }

    //Syntax: !tempname -[channelName]
    const newTitle = toTitleCase(cmd.content[0]);

    if (newTitle == null || newTitle == undefined) {
        return cmd.msg.reply({ content: 'You know, you only hurt yourself when you do this. I need the new channel name in order to change the current one.' })
            .then(sent => sent.delete({ timeout: 10000 }));
    }

    await currChannel.setName(newTitle).then(async editCh => {
        log('info', '[TEMP-NAME] Channel name changed to ' + newTitle);
        await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'update', { id: editCh.id, name: newTitle });
    });
}

function help() {
    return 'Changes the name of a temporary channel.';
}