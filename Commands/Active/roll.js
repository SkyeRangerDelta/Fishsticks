//Roll
//Does same thing as Dice
const dice = require('./dice');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls the dice. Accepts conditional parameters.');

function run(fishsticks, int) {
    int.deferReply();
    dice.run(fishsticks, int, true);
}

function help() {
    return 'Rolls the dice. Accepts conditional syntax.';
}

//Exports
module.exports = {
    name: 'roll',
    data,
    run,
    help
};