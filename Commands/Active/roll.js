//Roll
//Does same thing as Dice
const dice = require('./dice');

module.exports = {
    run,
    help
};

function run(fishsticks, cmd) {
    dice.run(fishsticks, cmd);
}

function help() {
    return 'Rolls the dice. Accepts conditional syntax.';
}