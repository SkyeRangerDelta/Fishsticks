// ---- IPs ----
// Displays a list of CC related game server IPs

//Imports
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

//Exports
module.exports = {
	run,
	help
};

//Functions
function run(fishsticks, cmd) {
    cmd.msg.delete();

    const ips = {
		title: 'o0o - THE FISH SERVERS - o0o',
		description: 'CCG recognized servers and their IPS.',
		delete: 60000,
		fields: [
			{
				name: 'ARK: Survival Evolved (Admin: Nils Sargon)',
				value: 'Socket: `158.69.13.88:51226` - Request password'
			},
			{
				name: 'Terraria (Admin: Winged Scribe)',
				value: 'Socket: `tr.pldyn.net:41213` - Request password'
			},
			{
				name: 'Minecraft (Admin: Minecraft Ops)',
				value: 'Socket: `ccgmc.pldyn.net` - Requires whitelisting'
			}
		],
		footer: 'If any IPs are bad, or missing - let a staff member know.',
		noThumbnail: true
	};

    cmd.channel.send({ embeds: [embedBuilder(ips)] }).then(s => { setTimeout(() => s.delete(), 60000); });
}

function help() {
	return 'Lists official CC game server IP addresses.';
}