// ---- Quote ----
// Adds a quote to FS quote pool

//Imports
const { generateRandomQuote } = require('../../Modules/Core/Core_Message');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');

//Exports
module.exports = {
	run,
	help
};

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

	//Syntax
	//!quote -[text]	: Inserts text as quote

	//TODO: ?
	//@Fishsticks in the context of a message reply	: Inserts the message being replied to as a quote
	//!quote -delete -[Index]	: Deletes the quote matching the index from the pool

	//Process
	if (cmd.content[0] === 'random' || !cmd.content[0]) {
		//Displays a random quote
		return await generateRandomQuote(fishsticks, cmd);
	}
	else {
		//Takes content as quote
		const quoteContent = cmd.content[0];
		const quoteNum = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'count');
		const quoteRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'insert', { id: quoteNum - 1, q: quoteContent });

		if (quoteRes.acknowledged === true) {
			cmd.reply('Added! (Index ' + (quoteNum - 1) + ').');
		}
	}
}

function help() {
	return 'Does quote things!';
}