// ==== Poem ====
//---------------
//Does things related to poetry

//Imports
const https = require('https');
const { log } = require('../../Modules/Utility/Utils_Log');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { SlashCommandBuilder } = require('@discordjs/builders');

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
    int.deferReply();
    const subCMD = int.options.getSubcommand();

    if (subCMD === 'random') {
        await buildPoem(int);
    }
    else {
        await int.editReply({ content: 'Nothing here yet. Be on your way.', ephemeral: true });
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

    for (let l = 1; l < 11; l++) {
        log('info', `[POEM] (${l}) Obtaining a suitable poem.`);
        poemObj = await fetchPoem();

        console.log(poemObj);

        //Make this easy and keep it to a small line count
        if (parseInt(poemObj.linecount) <= '20') break;
    }

    poemTxt = poemObj.lines.join('\n');

    if (poemTxt === '' || poemTxt.length > 2048) return int.editReply({ content: 'Failed to find a suitable poem!' });

	const poemEmbed = {
		title: `*${poemObj.title}* - ${poemObj.author}`,
		description: `${poemTxt}`,
        footer: 'API provided by PoetryDB.',
        noThumbnail: true
    };

	return int.editReply({ embeds: [embedBuilder(poemEmbed)] });
}

function help() {
    return 'Prints poems.';
}

//Exports
module.exports = {
    name: 'poem',
    data,
    run,
    help
};