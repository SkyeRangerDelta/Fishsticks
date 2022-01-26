//----BaconMode----

//Imports
const { SlashCommandBuilder } = require('@discordjs/builders');

//Functions
const data = new SlashCommandBuilder()
    .setName('baconmode')
    .setDescription('Slaps some bacon on all messages the target sends.');

data.addUserOption(u => u.setName('bacon-target').setDescription('The person whom needs to have bacon slapped onto.'));

function run(fishsticks, int) {
    //Collect target
    const target = int.options.getMember('bacon-target');

    //Validate
    if (!target) {
        console.log('[BAC-MODE] Target found to be null.');
        int.reply('Cleared the bacon target.')
            .then(sent => setTimeout(() => { sent.delete(); }, 10000));

        return fishsticks.baconTarget = null;
    }

    //Set target global
    try {
        fishsticks.baconTarget = target.id;
	}
	catch (error) {
        throw 'Bacon mode failed to engage.';
    }

    int.reply('Bacon mode engaged!')
        .then(sent => setTimeout(() => { sent.delete(); }, 10000));

}

function help() {
	return 'Enables BaconMode';
}

//Exports
module.exports = {
    name: 'baconmode',
    data,
    run,
    help
};