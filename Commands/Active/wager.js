// ---- Wager ----

//Imports
const { SlashCommandBuilder } = require('discord.js');
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
    return int.reply({ content: 'Command isnt ready just yet!', ephemeral: true });

    const cmdExecuted = int.options.getSubcommand();

    lotteries = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Lotteries', 'selectAll');
    if (lotteries.length === 0) await doLotteryInit(fishsticks, int);

    if (cmdExecuted === 'buy') return buy(fishsticks, int);
    if (cmdExecuted === 'close') return close(fishsticks, int);
}

async function buy(fishsticks, int) {
    //TODO: Implement buying a ticket/entering
}

async function close(fishsticks, int) {
    if (!hasPerms(int.member, ['Event Coordinator'])) {
        int.reply({ content: 'Only ECs can close the running lottery!', ephemeral: true });
    }

    //TODO: Implement term closures
}

async function doLotteryInit(fishsticks, int) {
    //Formulate the various lotteries
    const baseLotteries = [
        {
            name: 'CCG Events Bowl',
            description: 'A termed lottery used for CCG events. Starts and stops frequently.',
            drawTerm: 'termed',
            riskFactor: 1.0,
            jackpot: 0,
            tickets: 0,
            ticketPrice: 10
        },
        {
            name: 'Goldfish 24',
            description: 'Daily lottery. Pretty straightforward.',
            drawTerm: 'daily',
            riskFactor: 2.0,
            jackpot: 10,
            tickets: 0,
            ticketPrice: 10
        },
        {
            name: 'Goldfish 168',
            description: 'A weekly drawing lottery, slightly harder.',
            drawTerm: 'weekly',
            riskFactor: 2.0,
            jackpot: 100,
            tickets: 0,
            ticketPrice: 100
        },
        {
            name: 'After Hours 5000',
            description: 'Drawing ends once jackpot reaches 5,000. Pretty easy. Ticket prices variable.',
            drawTerm: 'interval',
            riskFactor: 1.0,
            jackpot: 0,
            tickets: 0,
            ticketPrice: 0
        },
        {
            name: 'Delta Thunderbowl',
            description: 'A high-stakes game, hard. Ticket prices fixed, goes until winners number is picked.',
            drawTerm: 'matched',
            riskFactor: 3.0,
            jackpot: 100,
            tickets: 0,
            ticketPrice: 100
        }
    ];

    const res = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Lotteries', 'insertMany', baseLotteries);
    if (res.insertedCount === 0 || res.insertedCount !== baseLotteries.length) {
        return int.reply({ content: 'Something went wrong with the system, should ping Skye.' });
    }
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