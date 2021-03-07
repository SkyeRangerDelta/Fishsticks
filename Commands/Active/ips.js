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
    cmd.msg.delete({ timeout: 0 });

    const ips = {
		title: 'o0o - THE FISH SERVERS - o0o',
		description: 'CCG recognized servers and their IPS.',
		fields: [
			{
				title: 'Official CC Servers',
				description: 'ARK: Survival Evolved (Admin: Nils Sargon): `158.69.13.88:51226` -Request password -\n' +
							'Terraria (Admin: Winged Scribe): `tr.pldyn.net:41213` -Request password -\n' +
							'Minecraft (Admin: SkyeRangerDelta): `ccgmc.pldyn.net` -Requires Whitelisting-'
			}
		]
	};

    cmd.msg.channel.send({ embed: embedBuilder(ips) }).then(sent => sent.delete({ timeout: 30000 }));
}

function help() {
	return 'Lists official CC game server IP addresses.';
}