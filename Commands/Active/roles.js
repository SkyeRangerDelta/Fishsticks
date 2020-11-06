//----ROLES----

module.exports = {
	run,
	help
};

function run(fishsticks, cmd) {
	cmd.msg.reply('Hey.');
}

function help() {
	return 'Lists roles (toggled via parameter).';
}