// ---- Quote ----
// Adds a quote to FS quote pool

//Exports
module.exports = {
	run
};

//Imports
const { quotes } = require('../../Modules/Library/quotesLib.json');

//Functions
function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

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
	}
	else {
		//Must be a text statement
	}
}