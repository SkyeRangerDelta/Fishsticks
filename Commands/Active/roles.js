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
function run(fishsticks, cmd) {
	listRoles(fishsticks, cmd);
}

function help() {
	return 'Lists roles (toggled via parameter).';
}