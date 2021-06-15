// ---- Quote ----
// Adds a quote to FS quote pool

//Exports
module.exports = {
	run,
	processReaction
};

//Imports
const fs = require('fs');

const { log } = require('../../Modules/Utility/Utils_Log');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');

const quotePath = '../../Modules/Library/quotesLib.json';

//Globals
let quoteLib = null;

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

	quoteLib = await loadPool();

	//Syntax
	//!quote -@person	: Grabs last message as quote
	//!quote -[text]	: Inserts text as quote
	//@Fishsticks in the context of a message reply	: Inserts the message being replied to as a quote
	//!quote -delete -[Index]	: Deletes the quote matching the index from the pool

	//Process
	if (cmd.content[1] === 'delete') {
		//Delete a quote from the pool
	}
	else if (cmd.msg.reference.channelID === cmd.channel.id) {
		//Message is referencing
	}
	else if (cmd.msg.mentions.users.first()) {
		//Not deleting, mentions a user
		const memberToQuote = cmd.msg.mentions.users.first();
		const msgToQuote = memberToQuote.lastMessage.fetch();

		const quoteMsg = msgToQuote.content;

		cmd.msg.channel.send('Are you sure you want to quote this?\n`' + quoteMsg + '`').then(sent => {
			sent.react('✅');
			sent.react('❌');

			fso_query(fishsticks.FSO_CONNECTION, 'Fs_QuoteRef', 'insert', { id: sent.id, quote: quoteMsg });
		});
	}
	else {
		//Must be a text statement
	}
}

function loadPool() {
	log('info', '[QUOTE] Loading quotes pool...');

	return JSON.parse(fs.readFileSync(quotePath, 'utf-8'));
}

async function processReaction(data) {

	quoteLib = await loadPool();

}