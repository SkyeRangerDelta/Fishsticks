// ---- Creative ----
//Toggles Creative role assignment

//Imports
const { creative } = require('../../Modules/Core/Core_ids.json');
const { hasPerms } = require('../../Modules/Utility/Utils_User');

//Exports
module.exports = {
	run,
	help
};

//Functions
async function run(fishsticks, cmd) {
	cmd.msg.delete({ timeout: 0 });

	const creativeRole = fishsticks.CCG.roles.cache.get(creative);

	if (hasPerms(cmd.msg.member, ['Creative'])) {
		cmd.msg.member.roles.remove(creativeRole, 'Toggled by command.');
		cmd.reply('Removed.', 10);
	}
	else {
		cmd.msg.member.roles.add(creativeRole, 'Toggled by command.');
		cmd.reply('Assigned.', 10);
	}
}

function help() {
	return 'Toggles the assignment of the Creative role.';
}