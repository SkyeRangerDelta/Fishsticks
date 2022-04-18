//----BaconMode----

//Imports
const { SlashCommandBuilder } = require('@discordjs/builders');

//Functions
const data = new SlashCommandBuilder()
    .setName('baconmode')
    .setDescription('Slaps some bacon on all messages the target sends.')
    .addSubcommand(s => s
        .setName('clear')
        .setDescription('Clear the bacon target.'))
    .addSubcommand(s => s
        .setName('target')
        .setDescription('Select someone to target.')
        .addUserOption(u => u
            .setName('bacon-target')
            .setDescription('The person whom needs to have bacon slapped onto.')
            .setRequired(true)
        )
    );

function run(fishsticks, int) {
    //Collect target
    const subCMD = int.options.getSubcommand();
    const target = int.options.getMember('bacon-target');

    //Validate
    if (subCMD === 'clear') {

        if (!fishsticks.baconTarget) {
            return int.reply({ content: 'But....there is no bacon target to clear!', ephemeral: true });
        }

        fishsticks.baconTarget = null;
        return int.reply({ content: 'Cleared the bacon target.', ephemeral: true });
    }

    //Set target global
    try {
        fishsticks.baconTarget = target.id;
	}
	catch (error) {
        throw 'Bacon mode failed to engage.';
    }

    int.reply({ content: 'Bacon mode engaged!', ephemeral: true });

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