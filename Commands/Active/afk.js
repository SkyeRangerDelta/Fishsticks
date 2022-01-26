//----AFK----
//Renames the AFK voice chat

//Imports
const chs = require('../../Modules/Core/Core_ids.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Functions
const data = new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Changes the name of the AFK channel.');

data.addStringOption(s => s.setName('a-starting-word').setDescription('Word that starts with A.').setRequired(true));
data.addStringOption(s => s.setName('f-starting-word').setDescription('Word that starts with F.').setRequired(true));
data.addStringOption(s => s.setName('k-starting-word').setDescription('Word that starts with K.').setRequired(true));

async function run(fishsticks, int) {
    if (int.options.length !== 3) {
        return int.reply('AFK has 3 words...', 10);
    }

    let newName = '';

    if (int.options[0].toLowerCase().charAt(0) !== 'a') {
        return int.reply({ content: '(A)FK - The word needs to start with an A!', ephemeral: true });
	}
	else if (int.options[1].toLowerCase().charAt(0) !== 'f') {
        return int.reply({ content: 'A(F)K - The word needs to start with an F!', ephemeral: true });
	}
	else if (int.options[2].toLowerCase().charAt(0) !== 'k') {
        return int.reply({ content: 'AF(K) - The word needs to start with a K!', ephemeral: true });
    }

    newName = 'AFK (' + int.options.join(' ') + ')';

    const AFKChannel = await fishsticks.channels.cache.get(chs.afkChannel);
    AFKChannel.setName(newName, 'The AFK command was used!')
        .then(int.reply({ content: 'Done!', ephemeral: true }));
}

function help() {
    return 'Changes the AFK channel name';
}

//Exports
module.exports = {
    name: 'afk',
    data,
    run,
    help
};