// ---- Quote ----
// Adds a quote to FS quote pool

//Imports
const { generateRandomQuote } = require( '../../Modules/Core/Core_Message' );
const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

//Globals
const data = new SlashCommandBuilder()
	.setName( 'quote' )
	.setDescription( 'Does quote things.' );

data.addSubcommand( s => s
		.setName( 'random' )
		.setDescription( 'Displays a random quote.' ) );

data.addSubcommand( s => s
		.setName( 'add' )
		.setDescription( '[WIP] Add a new quote to the pool.' ) );


data.addSubcommand( s => s
	.setName( 'show' )
	.setDescription( 'Lists a specific quote by ID from the pool.' )
	.addIntegerOption( i => i
		.setName( 'id' )
		.setDescription( 'The quote ID to display.' )
		.setRequired( true ) ) );

//Functions
async function run( fishsticks, int ) {
	await int.deferReply();
	const subCMD = int.options.getSubcommand();
	//Syntax /quote text?

	//TODO: ?
	//@Fishsticks quote in the context of a message reply	: Inserts the message being replied to as a quote
	///quote -delete -[Index]	: Deletes the quote matching the index from the pool

	//Process
	if ( subCMD === 'random' ) {
		//Displays a random quote
		const q = await generateRandomQuote( fishsticks, int );
		return int.editReply( { content: q } );
	}
	else if ( subCMD === 'show' ) {
		//Lists a specific quote by ID from the pool
		const qID = `${int.options.getInteger( 'id' )}`;

		try {
			const res = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'select', { id: qID } );
			
			int.editReply( { content: res.q } );
		}
		catch ( qErr ) {
			console.error( qErr );
			int.editReply( { content: `${ await getErrorResponse( int.client.user.displayName, 'quote', 'the command failed to find the targeted quote to post.' ) }` } );
		}
	}
	else {
		return int.editReply( {
			content: `${ await getErrorResponse( int.client.user.displayName, 'quote', 'this part of the command isn\'t finished quite yet.' ) }`,
			ephemeral: true
		} );
		/*
		//Takes content as quote
		const quoteNum = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'count');
		const quoteRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'insert', { id: quoteNum - 1, q: qText });

		if (quoteRes.acknowledged === true) {
			return int.reply({ content: 'Added! (Index ' + (quoteNum - 1) + ').', ephemeral: true });
		}
		else {
			return int.reply({ content: 'I dont know if that actually got added. Ping ' + fishsticks.RANGER});
		}

		 */
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