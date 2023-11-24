// ==== Poem ====
//---------------
//Does things related to poetry

//Imports
const https = require('https');
const { log } = require('../../Modules/Utility/Utils_Log');
const { lounge } = require('./Core_ids.json');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

//Globals
const data = new SlashCommandBuilder()
    .setName('poem')
    .setDescription('Prints poems');

data.addSubcommand(s => s
    .setName('random')
    .setDescription('Prints a random poem.'));

const API_URL = 'https://poetrydb.org/';

//Functions
async function run(fishsticks, int) {
    const subCMD = int.options.getSubcommand();

    if (subCMD === 'random') {
        await buildPoem(int);
    }
}

async function fetchPoem() {
    const payloadURL = `${API_URL}random`;

    let poemObj = '';

    return new Promise(function(resolve, reject) {
        https.get(payloadURL, (done) => {

            log('info', '[POEM] [RANDOM] Status: ' + done.statusCode);

            done.on('data', (content) => {
                poemObj += content;
            });

            done.on('end', function() {
                resolve(JSON.parse(poemObj)[0]);
            });

            done.on('error', err => {
                reject(err);
            });
        });
    });
}

async function buildPoem(int) {
    let poemObj;
    let poemTxt = '';

    for (let l = 1; l < 6; l++) {
        log('info', `[POEM] (${l}) Obtaining a suitable poem.`);
        poemObj = await fetchPoem();

        //Make this easy and keep it to a small line count
        if (parseInt(poemObj.linecount) <= '20') break;
    }

    if (poemObj.lines.length > 20) int.reply('Failed to find a suitable poem.');

    poemTxt = poemObj.lines.join('\n');

    if (poemTxt === '' || poemTxt.length > 2048 && int) {
        return int.reply({ content: 'Failed to find a suitable poem!' });
    }

    const poemEmbed = new EmbedBuilder()
        .setTitle(`*${poemObj.title}* - ${poemObj.author}`)
        .setDescription(`${poemTxt}`)
        .setFooter({
            text: 'API provided by PoetryDB.'
        });

	if (!int) { //doDailyPost
        return poemEmbed;
    }

    return int.reply({ embeds: [poemEmbed] });
}

function help() {
    return 'Prints poems.';
}

//Exports
module.exports = {
    name: 'poem',
    data,
    run,
    help,
    buildPoem
};