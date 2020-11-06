//----STATUS----

module.exports = {
	run,
	help
};

function run(fishsticks, cmd) {
	cmd.msg.reply('Hey.');
}

function help() {
	return 'Displays a list of all Fishsticks system states.';
}