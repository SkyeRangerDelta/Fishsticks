// ---- Creative ----
//Toggles Creative role assignment

//Imports
const { creative } = require('../../Modules/Core/Core_ids.json');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Functions
const data = new SlashCommandBuilder()
	.setName('creative')
	.setDescription('Toggles the Creative role assignment');

async function run(fishsticks, int) {
	const creativeRole = fishsticks.CCG.roles.cache.get(creative);

	if (hasPerms(int.member, ['Creative'])) {
		int.member.roles.remove(creativeRole, 'Toggled by command.');
		int.reply({ content: 'Removed.', ephemeral: true });
	}
	else {
		int.member.roles.add(creativeRole, 'Toggled by command.');
		int.reply({ content: 'Assigned.', ephemeral: true });
	}
}

function help() {
	return 'Toggles the assignment of the Creative role.';
}

//Exports
module.exports = {
	name: 'creative',
	data,
	run,
	help
};