// ---- Bible ----
//=================
//Takes specific input and prints out
//the respective passage

//Imports
const https = require('https');
const { log } = require('../../Modules/Utility/Utils_Log');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

const { bibleAPI } = require('../../Modules/Core/Core_keys.json');
const { primary } = require('../../Modules/Core/Core_config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('bible')
	.setDescription('Prints out Bible passages from the ESV bible.');

data.addNumberOption(o => o.setName('book-number').setDescription('The book book number; ie. 1 Samuel. (USE 0 IF THERE IS ONLY 1 BOOK).').setRequired(true));
data.addStringOption(o => o.setName('book').setDescription('The book to pull from.').setRequired(true));
data.addNumberOption(o => o.setName('chapter').setDescription('The chapter to pull (from).').setRequired(true));
data.addNumberOption(o => o.setName('verse').setDescription('The verse to pull.').setRequired(true));
data.addNumberOption(o => o.setName('end-verse').setDescription('The verse to end with.').setRequired(false));

async function run(fishsticks, int) {

    //Command breakup
    /*
        !bible -John -3:16
        !bible -John -3:16-19
        !bible -2 Samuel -1:1
        !bible -Genesis -1
    */
    //TODO: Add a means to determine random request

	//Parameter Object
	const params = {
		bookNum: int.options.getNumber('book-number'),
		book: int.options.getString('book') || 'John',
		chapter: int.options.getNumber('chapter') || 3,
		verse: int.options.getNumber('verse') || 16,
		endverse: int.options.getNumber('end-verse') || null,
		contCount: 1,
		bookFirst: false
	};

    if (params.bookNum === 0) {
        console.log('FIRED!');
        params.bookFirst = true;
    }

    await buildPayload(params, int);
}

//Construct a payload to be shipped off
async function buildPayload(paramObj, int) {
    console.log('Attempting to build a payload request.');

    const API_URL = 'https://api.esv.org/v3/passage/text/';

    let args;

    if (paramObj.bookFirst === true) {
		log('info', '[BIBLE] Book found first');

        if (paramObj.endverse == null) {
            args = {
                'q': `${paramObj.book}+${paramObj.chapter}:${paramObj.verse}`
            };
		}
		else {
            args = {
                'q': `${paramObj.book}+${paramObj.chapter}:${paramObj.verse}-${paramObj.endverse}`
            };
        }
	}
	else {
		log('info', '[BIBLE] Book not found first');

        if (paramObj.endverse == null) {
            args = {
                'q': `${paramObj.bookNum}+${paramObj.book}+${paramObj.chapter}:${paramObj.verse}`
            };
		}
		else {
            args = {
                'q': `${paramObj.bookNum}+${paramObj.book}+${paramObj.chapter}:${paramObj.verse}-${paramObj.endverse}`
            };
        }
    }

    const dispatchURL = API_URL + `?q=${args.q}`;

    const options = {
        headers: {
           'Authorization': `Token ${bibleAPI}`,
           'Content-Type': 'application/json'
        }
    };

    console.log('Dispatching payload:\n' + dispatchURL);

    https.get(dispatchURL, options, async (res) => {
        res.on('data', content => {

            const received = JSON.parse(content);
            console.log(received);
            console.log(received.passages);

            if (!received.passages) {
                return int.reply({ content: 'Couldnt find any passages!', ephemeral: true });
            }
            else if (received.passages[0].length > 2048) {
                return int.reply({ content: 'The passage is too large! Try breaking it into smaller verses.', ephemeral: true });
            }

            const verseEmbed = {
				title: 'o0o - Bible (ESV) - o0o',
				color: primary,
				description: received.passages.toString(),
				footer: 'ESV Bible provided by Crossway Publishers; licensed to Fishsticks.'
			};

            int.reply({ embeds: [embedBuilder(verseEmbed)] });
        });
    });
}

function help() {
	return 'Prints out a Bible passage';
}

//Exports
module.exports = {
	name: 'bible',
	data,
	run,
	help
};