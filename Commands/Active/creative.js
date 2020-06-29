// ---- Creative ----

//Imports
const { creative } = require('../../Modules/Core/Core_ids.json');

//Exports
module.exports = {
	run,
	help
};

//Functions
async function run(fishsticks, cmd) {
	const creativeRole = fishsticks.CCG.roles.cache.get(creative);

	if (cmd.msg.member.roles.cache.some(role => role.name == 'Creative')) {
		cmd.msg.member.roles.remove(creativeRole, 'Toggled by command.');
	}
	else {
		cmd.msg.member.roles.add(creativeRole, 'Toggled by command.');
	}
}

function help() {
	return 'Toggles the assignment of the Creative role.';
}