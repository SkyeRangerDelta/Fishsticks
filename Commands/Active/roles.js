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
	await listRoles(fishsticks, cmd);
}

function help() {
	return 'Lists roles (toggled via parameter).';
}