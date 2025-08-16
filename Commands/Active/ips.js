// ---- IPs ----
// Displays a list of CC related game server IPs

//Imports
const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );

//Globals
const data = new SlashCommandBuilder()
	.setName( 'ips' )
	.setDescription( 'Prints out all CCG game server sockets.' );

//Functions
function run( fishsticks, int ) {
    const ips = {
		title: 'o0o - THE FISH SERVERS - o0o',
		description: 'CCG recognized servers and their IPS.',
		delete: 60000,
		fields: [
			{
				name: '~~ARK: Survival Evolved (Admin: Nils Sargon)~~',
				value: '~~Socket: `158.69.13.88:51226` - Request password~~'
			},
			{
				name: '~~Terraria (Admin: Winged Scribe)~~',
				value: '~~Socket: `tr.pldyn.net:41213` - Request password~~'
			},
			{
				name: 'Minecraft (Admin: Minecraft Ops)',
				value: 'Socket: `ccgmc.pldyn.net` - Requires whitelisting'
			},
			{
				name: 'CCG DST (Admin: Winged Scribe)',
				value: 'Look up *CCG* in the server browser - Request password'
			}
		],
		footer: {
			text: 'If any IPs are bad, or missing - let a staff member know. Items with strikethroughs are no longer active.'
		},
		noThumbnail: true
	};

    int.reply( { embeds: [embedBuilder( fishsticks, ips )], flags: MessageFlags.Ephemeral } );
}

function help() {
	return 'Lists official CC game server IP addresses.';
}

//Exports
module.exports = {
	name: 'ips',
	data,
	run,
	help
};