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

//Exports
module.exports = {
	run,
	help
};

async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    //Command breakup
    /*
        !bible John 3:16
        !bible John 3:16-19
        !bible 2 Samuel 1:1
        !bible Genesis 1
    */
    //TODO: Add a means to determine random request

    const params = {
        bookNum: null,
        book: 'John',
        chapter: 3,
        verse: 16,
        endverse: null,
        contCount: 1,
        bookFirst: false
    };

    // ['!bible', '2', 'Samuel', '1:1']
    // q='John+3:16'

    const cmdArgs = cmd.msg.content.toLowerCase().split(' ');
    params.bookNum = parseInt(cmdArgs[1].substring(1, 2)); //Set default book number

    if (params.bookNum == null || isNaN(params.bookNum)) { //If no book number
        params.book = cmdArgs[1].substring(1, cmdArgs[1].length);
        params.bookFirst = true;
	}
	else { //Get book
		log('info', '[BIBLE] Pulling book info');

        if (typeof cmdArgs[2] === typeof 'blah') {
			params.book = cmdArgs[2];
		}
		else {
			return cmd.msg.reply('Books titles are names not numbers.').then(sent => sent.delete({ timeout: 10000 }));
        }
    }

	//Handle chapter and verse build
	let verseBreak;

    if (params.bookFirst) { //If not 1 Samuel
        const chapterBreak = cmdArgs[2].split(':');
		params.chapter = chapterBreak[0];

        if (params.chapter.includes('-')) { //Check for verse range
            verseBreak = chapterBreak[1].split('-');
            params.verse = verseBreak[0];
            params.endverse = verseBreak[1];
		}
		else {
            params.verse = chapterBreak[1];
        }
	}
	else {
        const chapterBreak2 = cmdArgs[3].split(':');
        params.chapter = chapterBreak2[0];

        if (params.chapter.includes('-')) {
            verseBreak = chapterBreak2[1].split('-')[0];
            params.verse = verseBreak[0];
            params.endverse = verseBreak[1];
		}
		else {
            params.verse = chapterBreak2[1];
        }
    }

    buildPayload(params, cmd.msg);
}

//Construct a payload to be shipped off
async function buildPayload(paramObj, msg) {

    console.log('Attempting to build a payload request with the following information:\nParams:');
    console.log(paramObj);

    const API_URL = 'https://api.esv.org/v3/passage/text/';

    let args;

    if (paramObj.bookFirst) {
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
            if (received.passages[0].length > 2048) {
                return msg.reply('The passage is too large! Try breaking it into smaller verses.').then(sent => sent.delete({ timeout: 10000 }));
            }

            const verseEmbed = {
				title: 'o0o - Bible (ESV) - o0o',
				color: primary,
				description: received.passages
			};

            msg.channel.send({ embed: embedBuilder(verseEmbed) });
        });
    });
}

function help() {
	return 'Prints out a Bible passage';
}