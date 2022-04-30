// ---- Temp Name ----
// Changes the name of a temporary channel

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('tempname')
    .setDescription('Changes the name of a temporary channel.');

data.addStringOption(o => o.setName('new-name').setDescription('The name to set the channel to.').setRequired(true));

//Functions
async function run(fishsticks, int) {
    const currChannel = int.member.voice.channel;
    if (!currChannel) {
        return int.reply({ content: 'But...youre not in a voice channel. Why?', ephemeral: true });
    }

    const chRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'select', { id: currChannel.id });
    if (!chRes) {
        return int.reply({ content: 'Thats not a temp channel.', ephemeral: true });
    }

    //Syntax: /tempname new-name
    const newTitle = int.options.getString('new-name');

    if (!newTitle) {
        return int.reply({ content: 'You know, you only hurt yourself when you do this. I need the new channel name in order to change the current one.', ephemeral: true });
    }

    await currChannel.setName(newTitle).then(async editCh => {
        log('info', '[TEMP-NAME] Channel name changed to ' + newTitle);
        await fso_query(fishsticks.FSO_CONNECTION, 'FSO_TempCh', 'update', { $set: { name: newTitle } }, { id: editCh.id });

        return int.reply({
            content: 'Done!',
            ephemeral: true
        });
    });
}

function help() {
    return 'Changes the name of a temporary channel.';
}

//Exports
module.exports = {
    name: 'tempname',
    data,
    run,
    help
};