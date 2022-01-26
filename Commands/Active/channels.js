//Imports
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

const { primary } = require('../../Modules/Core/Core_config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Functions
const data = new SlashCommandBuilder()
	.setName('channels')
	.setDescription('Prints out a description of all the channels.');

function run(fishsticks, int) {
    const channelsPanel = {
		title: 'o0o - Channels - o0o',
		description: 'A list of all the channels in CC and a brief description.\n' +
						'Note the following key:\n🔇: You should mute channels with this icon.\n🔒: Channels with this require extra permissions.',
		color: primary,
		footer: 'Ask staff for more info.',
		delete: 60000,
		fields: [
			{
				name: 'Server Channels',
				value:
					'**Rules**: A listing of all of CCGs community rules.\n' +
					'**Fishsticks Info**: A basic list of resources to use Fishsticks.\n' +
					'**Announcements**: Look here for community events and info news.'
			},
			{
				name: 'CCG Channels',
				value:
					'🔒 **Crash Pad**: Landing zone for newcomers, anti-troll measure.\n' +
					'**Hangout**: General Chat 1\n' +
					'**Lounge**: General Chat  2\n' +
					'**Memes**: For memes, duh.\n' +
					'**Hall of Aptitude**: Channel for posting art and creative media.\n' +
					'🔇 **Hall of Spontaneity**: Chat channel for those without mics.\n' +
					'**Tech Chat**: Discuss technical stuff.\n' +
					'**Production Studio**: Discuss content and media creation.\n' +
					'**WCCM CC Radio**: Share music and podcasts.\n' +
					'**Meeting Hall**: Chat channel for all things CCG Meeting related.'
			},
			{
				name: 'CCG Voice Channels',
				value: 'These are all voice chats despite not being denoted.\n' +
					'**Hangout**: General Voice Chat 1 (visible to Crash Pad)\n' +
					'**Lounge**: Geneeral Voice Chat 2\n' +
					'**Hall of Aptitude**: For those creative vocal sessions.\n' +
					'**Meeting Hall**: Where CCG Meetings take place. Gather here bi-weekly.\n' +
					'🔒 **Closed Section**: Staff only meeting section.'
			},
			{
				name: 'Ministry',
				value:
					'**Prayer Requests**: Have a prayer or praise concern? Post it here.\n' +
					'**Bible Study**: Its for bible study on Thursday nights.\n' +
					'**Discussion Den**: A place for **serious** and **civil** discussion on any topic.\n' +
					'**(V) Power Prayer Tuesdays**: Power Prayer Tuesday night channel.\n' +
					'**(V) Bible Study**: The voice channel for Bible Study.'
			},
			{
				name: 'Games Chatter',
				value:
					'**Games**: General games chat.\n' +
					'🔒 Games below #games require the necesary game role to join. See `!codex role` for more.'
			},
			{
				name: 'Games Chatter Voice',
				value:
					'**Games Room #1** (Same for #2): General games voicee chat.\n' +
					'Games listed below the game rooms are game-topic specific but do not require roles to join.'
			},
			{
				name: 'Temp Channels',
				value: 'Need a channel but dont see one to fit your needs? Make your own! See `!codex tempch`.'
			},
			{
				name: 'Misc',
				value:
					'🔒 **Art Gallery**: Members only art/creative den.\n' +
					'🔒 **The Gym**: Members only health/recipe/foodie chat channel.\n' +
					'**Tech Chat**: Chat for technical stuff; PC builds, development, etc.\n' +
					'🔇 **Fishsticks Music Log**: Music log dump for Fishsticks (Please use Rhythm here if applicable).\n' +
					'🔇🔒 **Fishsticks System Log** Live logging console of Fishsticks activity.\n' +
					'**Fishsticks Console**: Skyes testing zone. Be careful in here.\n' +
					'🔒 **Conference Room**: Members only chat.\n' +
					'🔒 **Bot Logger**: Logger bot output.\n' +
					'🔒 **Altdentifier Log**: Altys log output.\n' +
					'**(V) Art Gallery**: Voice for Art Gallery.\n' +
					'**(V) Conference Room**: Voice for Conference Room.\n' +
					'**AFK (Someting in here)**: The AFK channel.'
			}
		]
	};

	int.reply({ embeds: [embedBuilder(channelsPanel)], ephemeral: true })
		.then(sent => {
			setTimeout(() => sent.delete(), 30000);
		});
}

function help() {
	return 'Displays a list of the descriptions of all channels.';
}

//Exports
module.exports = {
	name: 'channels',
	data,
	run,
	help
};