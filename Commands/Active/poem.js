// ==== Poem ====
//---------------
//Does things related to poetry

//Imports
const https = require('https');
const { log } = require('../../Modules/Utility/Utils_Log');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

//Exports
module.exports = {
    run,
    fetchDailyPoem,
    buildPoem,
    help
};

//Globals
const API_URL = 'https://poetrydb.org/';

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.reply('This may take a moment.').then(async sent => {
        if (cmd.content[0] === 'random') {
            const poemToSend = await buildPoem();
            cmd.channel.send({ embeds: [poemToSend] });
        }
        else {
            cmd.reply('Nothing here yet. Be on your way.', 10);
        }


        cmd.msg.delete();
        sent.delete();
    });
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