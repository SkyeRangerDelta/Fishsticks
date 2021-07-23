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
	if (cmd.content[1] === 'random') {
		//Displays a random quote

	}
	else if (cmd.msg.reference.channelID === cmd.channel.id) {
		//Message is referencing
		const quoteMsgObj = await cmd.msg.channel.messages.fetch(cmd.msg.reference.messageID);

		const quoteMsg = quoteMsgObj.content;

		await confirmQuoteAddition(fishsticks, cmd, quoteMsg);
	}
	else if (cmd.msg.mentions.users.first()) {
		//Not deleting, mentions a user
		const memberToQuote = cmd.msg.mentions.users.first();
		const msgToQuote = await memberToQuote.lastMessage.fetch();

		const quoteMsg = msgToQuote.content;

		await confirmQuoteAddition(fishsticks, cmd, quoteMsg);
	}
	else {
		//Must be a text statement
		const quoteMsg = cmd.content[0];

		await confirmQuoteAddition(fishsticks, cmd, quoteMsg);
	}
}

function loadPool() {
	log('info', '[QUOTE] Loading quotes pool...');

	return JSON.parse(fs.readFileSync(quotePath, 'utf-8'));
}

function writeQuotes() {
	return fs.writeFileSync(quotePath, JSON.stringify(quoteLib));
}

async function processReaction(data) {

	quoteLib = await loadPool();

	quoteLib.push(data.quote);

	await writeQuotes();
}

async function confirmQuoteAddition(fishsticks, cmd, data) {
	const quoteMsg = data;

	cmd.msg.channel.send('Are you sure you want to quote this?\n`' + quoteMsg + '`').then(sent => {
		sent.react('✅');
		sent.react('❌');

		fso_query(fishsticks.FSO_CONNECTION, 'Fs_QuoteRef', 'insert', { id: sent.id, quote: quoteMsg });
	});
}