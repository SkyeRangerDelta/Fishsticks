//----ROLES----
// Lists all roles

//Imports
const { listRoles } = require('./role');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
	.setName('roles')
	.setDescription('Lists all the game/user roles.');

//Functions
async function run(fishsticks, int) {
	int.deferReply({ ephemeral: true });
	await listRoles(fishsticks, int, true);
}

function help() {
	return 'Lists roles (toggled via parameter).';
}

//Exports
module.exports = {
	name: 'roles',
	data,
	run,
	help
};