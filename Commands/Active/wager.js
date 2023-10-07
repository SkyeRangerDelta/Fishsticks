// ---- Wager ----

//Imports
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');

//Functions
const data = new SlashCommandBuilder()
    .setName('wager')
    .setDescription('Interact with the Goldfish Bowl.');

data.addSubcommand(s => s
    .setName('buy')
    .setDescription('Make a market transaction.')
);

data.addSubcommand(s => s
    .setName('close')
    .setDescription('Closes the lottery term.')
);

let lotteries = [];

async function run(fishsticks, int) {
    const cmdExecuted = int.options.getSubcommand();

    lotteries = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Lotteries', 'selectAll');
    if (lotteries.length === 0) await doLotteryInit(fishsticks, int);

    if (cmdExecuted === 'buy') return buy(fishsticks, int);
    if (cmdExecuted === 'close') return close(fishsticks, int);
}

async function buy(fishsticks, int) {

}

async function close(fishsticks, int) {
    if (!hasPerms(int.member, ['Event Coordinator'])) {
        int.reply({ content: 'Only ECs can close the running lottery!', ephemeral: true });
    }


}

function doLotteryInit(fishsticks, int) {
    
}

function help() {
    return 'Buy into the goldfish lottery; buy tickets, maybe win big.';
}


//Exports
module.exports = {
    name: 'Wager',
    data,
    run,
    help
};