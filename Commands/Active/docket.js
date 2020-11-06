//----DOCKET----
//Add, edit, delete points for meetings

//Imports


//Exports
module.exports = {
	run,
	help
};

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

	//!docket
	//!docket -[a | add] -[description] -[s | sticky]
	//!docket -[e | edit] -[new description] -[s | sticky]
	//!docket -[d | delete] -(#)
}

function help() {
	return 'Add, edit, or delete points for community meetings.';
}