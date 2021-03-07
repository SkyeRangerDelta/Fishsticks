//----STATUS----
// Generates a status report on Fs systems

//Exports
module.exports = {
	run,
	help
};

//Functions
function run(fishsticks, cmd) {
	cmd.msg.reply('Hey.');
}

function help() {
	return 'Displays a list of all Fishsticks system states.';
}