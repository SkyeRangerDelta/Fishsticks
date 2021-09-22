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
        !bible -John -3:16
        !bible -John -3:16-19
        !bible -2 -Samuel -1:1
        !bible -Genesis -1
    */
    //TODO: Add a means to determine random request

	//Parameter Object
	const params = {
		bookNum: null,
		book: 'John',
		chapter: 3,
		verse: 16,
		endverse: null,
		contCount: 1,
		bookFirst: false
	};

	//--------------- Parse the thing ----------------------

	console.log('Cmd Content: ' + cmd.content);

	//Parse book/bookNum
	if (!cmd.content[0]) {
		return cmd.msg.reply({ content: 'This only works when you specify all the parameters. Start with specifying a book.' })
			.then(sent => sent.delete({ timeout: 10000 }));
	}
	else if (isNaN(cmd.content[0])) {
		//Not a numerical book
		params.book = cmd.content[0];
		params.bookFirst = true;
	}
	else {
		//Numerical Book (-2 -Samuel -1:1-1)
		params.bookNum = cmd.content[0];
		params.book = cmd.content[1];
	}

	//Parse everything else
	if (params.bookFirst) {
		if (!cmd.content[1]) {
			return cmd.msg.reply({ content: 'Gonna need a bit more than that, whats the chapter and verse(s) then?' })
				.then(sent => sent.delete({ timeout: 10000 }));
		}

		//Breakup chapter and verse (3:11-16)
		const chapterParam = cmd.content[1];
		console.log('chapterParam: ' + chapterParam);

		if (chapterParam.includes(':')) {
			//Has at least a starting verse
			const chBreakup = chapterParam.split(':');
			console.log('ChBreakup: ' + chBreakup);

			if (isNaN(chBreakup[0])) {
				return cmd.msg.reply({ content: 'Hey, hey, hey, thats not a chapter number. Cmon.' })
					.then(sent => sent.delete({ timeout: 10000 }));
			}
			else {
				params.chapter = chBreakup[0];
			}

			if (!chBreakup[1] || isNaN(chBreakup[1])) {
				return cmd.msg.reply({ content: 'That wasnt a verse number. I dont know what that was.' })
					.then(sent => sent.delete({ timeout: 10000 }));
			}
			else {
				params.verse = chBreakup[1];
			}
		}
		else {
			//Just the chapter?
			return cmd.msg.reply({ content: 'Nope, give me a verse. Not gonna post a whole chapter.' })
				.then(sent => sent.delete({ timeout: 10000 }));
		}

		if (cmd.content[2] && !isNaN(cmd.content[2])) {
			//End verse exists
			params.endverse = cmd.content[2];
		}

	}
	else {
		//Book is numerical (2 Samuel)
		if (!cmd.content[2]) {
			return cmd.msg.reply({ content: 'Gonna need a bit more than that, whats the chapter and verse(s) then?' })
				.then(sent => sent.delete({ timeout: 10000 }));
		}

		//Breakup chapter and verse (3:11-16)
		const chapterParam = cmd.content[2];
		console.log('chapterParam: ' + chapterParam);

		if (chapterParam.includes(':')) {
			//Has at least a starting verse
			const chBreakup = chapterParam.split(':');
			console.log('ChBreakup: ' + chBreakup);

			if (isNaN(chBreakup[0])) {
				return cmd.msg.reply({ content: 'Hey, hey, hey, thats not a chapter number. Cmon.' })
					.then(sent => sent.delete({ timeout: 10000 }));
			}
			else {
				params.chapter = chBreakup[0];
			}

			if (!chBreakup[1] || isNaN(chBreakup[1])) {
				return cmd.msg.reply({ content: 'That wasnt a verse number. I dont know what that was.' })
					.then(sent => sent.delete({ timeout: 10000 }));
			}
			else {
				params.verse = chBreakup[1];
			}
		}
		else {
			//Just the chapter?
			return cmd.msg.reply({ content: 'Nope, give me a verse. Not gonna post a whole chapter.' })
				.then(sent => sent.delete({ timeout: 10000 }));
		}

		if (cmd.content[3] && !isNaN(cmd.content[3])) {
			//End verse exists
			params.endverse = cmd.content[2];
		}
	}

    await buildPayload(params, cmd.msg);
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
                return msg.reply({ content: 'The passage is too large! Try breaking it into smaller verses.' })
					.then(sent => sent.delete({ timeout: 10000 }));
            }

            const verseEmbed = {
				title: 'o0o - Bible (ESV) - o0o',
				color: primary,
				description: received.passages,
				footer: 'ESV Bible provided by Crossway Publishers; licensed to Fishsticks.'
			};

            msg.channel.send({ embeds: [embedBuilder(verseEmbed)] });
        });
    });
}

function help() {
	return 'Prints out a Bible passage';
}