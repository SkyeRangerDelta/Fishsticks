// ---- Wager ----

//Imports
const { SlashCommandBuilder, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { ModalBuilder, TextInputBuilder } = require('@discordjs/builders');
const { TextInputStyles } = require('discord.js/typings/enums');

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
    if (lotteries.length === 0) lotteries = await doLotteryInit(fishsticks, int);

    if (cmdExecuted === 'buy') return buy(fishsticks, int, lotteries);
    if (cmdExecuted === 'close') return close(fishsticks, int, lotteries);
}

async function buy(fishsticks, int, acceptedLotteries) {
    //Select lottery first
    const availLotteries = [];
    for (const lottery of acceptedLotteries) {
        availLotteries.push(`${lottery.name} [${lottery.lotCode}]`);
    }
    const msgRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('LOT-BuyM')
                .setPlaceholder('Cancel')
                .setMaxValues(5)
                .setMinValues(1)
                .addOptions(availLotteries)
        );

    return int.reply({ content: 'Choose a lottery to buy a ticket from.', components: [msgRow], ephemeral: true });
}

async function buyModal(fishsticks, int) {
    const buyForm = new ModalBuilder()
        .setCustomId('LOT-Buy')
        .setTitle('Buy a Lottery Ticket');

    //Determine lottery type
    const changedVals = int.values;
    const compArr = [];
    for (const selectedLottery of changedVals) {
        const lotCode = selectedLottery.substring(selectedLottery.length - 5, selectedLottery.length());
        const lotteryData = await fso_query(fishsticks.FSO_CONNECTION,
            'FSO_Lotteries', 'select', { lotCode: lotCode });

        compArr.push(fetchLotComp(lotCode, lotteryData));
    }
}

function fetchLotComp(lotCode, lotteryObj) {
    const comps = {
        'CCEB': new TextInputBuilder()
            .setLabel(`[CC Events Bowl] Enter a submission.`)
            .setStyle(TextInputStyles.SHORT)
            .setRequired(false)
            .setPlaceholder('Random Text - but usernames work fine.'),
        'GFDA': new TextInputBuilder()
            .setLabel(),
        'GFWE': new TextInputBuilder(),
        'AFHR': new TextInputBuilder(),
        'DETH': new TextInputBuilder()
    };

    return comps[lotCode];
}

async function close(fishsticks, int, lotteries) {
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
            lotCode: 'CCEB',
            description: 'A termed lottery used for CCG events. Starts and stops frequently.',
            drawTerm: 'termed',
            riskFactor: 1.0,
            jackpot: 0,
            tickets: [],
            ticketPrice: 0
        },
        {
            name: 'Goldfish 24',
            lotCode: 'GFDA',
            description: 'Daily lottery. Pretty straightforward.',
            drawTerm: 'daily',
            riskFactor: 2.0,
            jackpot: 10,
            tickets: [],
            ticketPrice: 10
        },
        {
            name: 'Goldfish 168',
            lotCode: 'GFWE',
            description: 'A weekly drawing lottery, slightly harder.',
            drawTerm: 'weekly',
            riskFactor: 2.0,
            jackpot: 100,
            tickets: [],
            ticketPrice: 100
        },
        {
            name: 'After Hours 5000',
            lotCode: 'AFHR',
            description: 'Drawing ends once jackpot reaches 5,000. Pretty easy. Ticket prices variable.',
            drawTerm: 'interval',
            riskFactor: 1.0,
            jackpot: 0,
            tickets: [],
            ticketPrice: 0
        },
        {
            name: 'Delta Thunderbowl',
            lotCode: 'DETH',
            description: 'A high-stakes game, hard. Ticket prices fixed, goes until winners number is picked.',
            drawTerm: 'matched',
            riskFactor: 3.0,
            jackpot: 100,
            tickets: [],
            ticketPrice: 100
        }
    ];

    const res = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Lotteries', 'insertMany', baseLotteries);
    if (res.insertedCount === 0 || res.insertedCount !== baseLotteries.length) {
        return int.reply({ content: 'Something went wrong with the system, should ping Skye.' });
    }
    else {
        return await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Lotteries', 'selectAll');
    }
}

function handleLotteryModal(fishsticks, int) {
    //TODO: Implement actually buying the ticket(s)
}

function help() {
    return 'Buy into the goldfish lottery; buy tickets, maybe win big.';
}


//Exports
module.exports = {
    name: 'Wager',
    data,
    run,
    help,
    handleLotteryModal,
    buyModal
};