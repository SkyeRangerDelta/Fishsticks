// ---- Strike ----
//Issues a den strike to someone

//Imports
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('strike')
    .setDescription('Assigns a strike to a server member. [Mod+] [WIP]');

//Functions
function run(fishsticks, int) {
    int.reply({ content: 'Nonono, not just yet.', ephemeral: true });
}

function help() {
    return 'Moderation command for den strikes.';
}

//Exports
module.exports = {
    name: 'strike',
    data,
    run,
    help
};