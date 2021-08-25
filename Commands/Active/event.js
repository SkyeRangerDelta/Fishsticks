// ---- EVENT ----
// Primary handler for scheduling and calendar readouts

//Exports
module.exports = {
	run,
	help
};

//Imports


//Functions
function run(fishsticks, cmd) {
	cmd.msg.reply('Mmmm. What fun - an empty command.').then(sent => sent.delete({ timeout: 10000 }));
}

function help() {
	return 'Handles event scheduling and calendar readouts';
}