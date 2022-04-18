// ---- Quote ----
// Adds a quote to FS quote pool

//Imports
const { generateRandomQuote } = require('../../Modules/Core/Core_Message');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
	.setName('quote')
	.setDescription('Does quote things.')
	.addStringOption(o => o
		.setName('quote-text')
		.setDescription('The text to quote.')
	);

//Functions
async function run(fishsticks, int) {

	//Syntax /quote text?

	//TODO: ?
	//@Fishsticks quote in the context of a message reply	: Inserts the message being replied to as a quote
	///quote -delete -[Index]	: Deletes the quote matching the index from the pool

	//Process
	int.deferReply();
	const qText = int.options.getString('quote-text');
	if (!qText) {
		//Displays a random quote
		const q = await generateRandomQuote(fishsticks, int);
		await int.editReply({ content: q });
	}
	else {
		//Takes content as quote
		const quoteNum = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'count');
		const quoteRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'insert', { id: quoteNum - 1, q: qText });

		if (quoteRes.acknowledged === true) {
			int.reply({ content: 'Added! (Index ' + (quoteNum - 1) + ').', ephemeral: true });
		}
		else {
			int.reply({ content: 'I dont know if that actually got added. Ping ' + fishsticks.RANGER });
		}
	}
}

function help() {
	return 'Does quote things!';
}

//Exports
module.exports = {
	name: 'quote',
	data,
	run,
	help
};