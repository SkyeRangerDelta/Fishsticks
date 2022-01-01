//----ROLES----
// Lists all roles

//Imports
const { listRoles } = require('./role');

//Exports
module.exports = {
	run,
	help
};

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.delete();

	await listRoles(fishsticks, cmd, true);
}

function help() {
	return 'Lists roles (toggled via parameter).';
}