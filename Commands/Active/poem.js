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
    const subCMD = int.options.getSubcommand();
    return int.reply({
        content: 'The API used by FS to pull poems is disabled for some unknown reason. This command will resume functionality when API access has been restored.'
    });

    if (subCMD === 'random') {
        const poemToSend = await buildPoem();
        await int.editReply({ embeds: [poemToSend] });
    }
    else {
        await int.editReply({ content: 'Nothing here yet. Be on your way.', ephemeral: true });
    }
}

async function fetchDailyPoem() {
    const payloadURL = `${API_URL}random`;

    let poemObj = '';

    return new Promise(function(resolve, reject) {
        https.get(payloadURL, (done) => {

            log('info', '[POEM] [RANDOM] Status: ' + done.statusCode);

            done.on('data', (content) => {
                poemObj += content;
            });

            done.on('end', function() {
                resolve(JSON.parse(poemObj));
            });

            done.on('error', err => {
                reject(err);
            });
        });
    });
}

async function buildPoem() {
    let poemObj = '';
    let poemTxt = '';
    const maxSize = 2048;
    let limit = 0;

    do {
        log('info', `[POEM] (${limit}) Obtaining a suitable poem.`);
        poemObj = await fetchDailyPoem();
        poemTxt = poemObj[0].lines.join('\n');
        limit++;
    }
    while (poemTxt.length >= maxSize && limit < 11);

	const poemEmbed = {
		title: `[From the Fishsticks Poetry Archive] ${poemObj[0].title}`,
		description: `${poemTxt}`,
        footer: `${poemObj[0].title} by ${poemObj[0].author} provided by PoetryDB.`,
        noThumbnail: true
    };

	return embedBuilder(poemEmbed);
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