// ---- EVENT ----
// Primary handler for scheduling and calendar readouts

//Exports
module.exports = {
	run,
	help
};

//Imports
const { schedule } = require('../../Modules/Core/Core_ids.json');


//Functions
function run(fishsticks, cmd) {
	cmd.reply('Mmmm. What fun - an empty command.', 10);

	//Syntax: !event -a/d/e/r
	//!event -a | add -DAY -HR:MIN:TZ -event title -event desc
	//!event -d | delete -DAY -HR:MIN:TZ
	//!event -e | edit -DAY -HR:MIN:TZ -event title -event desc
	//!event -r | reload
	//!event -t | toggleDST
}

function help() {
	return 'Handles event scheduling and calendar readouts';
}