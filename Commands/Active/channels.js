//Imports
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

const { primary } = require('../../Modules/Core/Core_config.json');

//Exports
module.exports = {
	run,
	help
};

function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    const channelsPanel = {
		title: 'o0o - Channels - o0o',
		description: 'A list of all the channels in CC and a brief description.\n' +
						'Note the following key:\n🔇: You should mute channels with this icon.\n🔒: Channels with this require extra permissions.',
		color: primary,
		footer: 'Ask staff for more info.',
		delete: 60000,
		fields: [
			{
				title: 'Server Channels',
				description:
					'**Rules**: A listing of all of CCGs community rules.\n' +
					'**Fishsticks Info**: A basic list of resources to use Fishsticks.\n' +
					'**Announcements**: Look here for community events and info news.'
			},
			{
				title: 'CCG Channels',
				description:
					'🔒 **Crash Pad**: Landing zone for newcomers, anti-troll measure.\n' +
					'**Hangout**: General Chat 1\n' +
					'**Lounge**: General Chat  2\n' +
					'**Memes**: For memes, duh.\n' +
					'**Hall of Aptitude**: Channel for posting art and creative media.\n' +
					'🔇 **Hall of Spontaneity**: Chat channel for those without mics.\n' +
					'**Movie Theatre**: Chat channel for movie/video streams.\n' +
					'**Meeting Hall**: Chat channel for all things CCG Meeting related.'
			},
			{
				title: 'CCG Voice Channels',
				description: 'These are all voice chats despite not being denoted.\n' +
					'**Hangout**: General Voice Chat 1 (visible to Crash Pad)\n' +
					'**Lounge**: Geneeral Voice Chat 2\n' +
					'**Hall of Aptitude**: For those creative vocal sessions.\n' +
					'**Meeting Hall**: Where CCG Meetings take place. Gather here bi-weekly.\n' +
					'🔒 **Closed Section**: Staff only meeting section.'
			},
			{
				title: 'Ministry',
				description:
					'**Prayer Requests**: Have a prayer or praise concern? Post it here.\n' +
					'**Bible Study**: Its for bible study on Thursday nights.\n' +
					'**Discussion Den**: A place for **serious** and **civil** discussion on any topic.\n' +
					'**(V) Power Prayer Tuesdays**: Power Prayer Tuesday night channel.\n' +
					'**(V) Bible Study**: The voice channel for Bible Study.'
			},
			{
				title: 'Games Chatter',
				description:
					'**Games**: General games chat.\n' +
					'🔒 Games below #games require the necesary game role to join. See `!codex role` for more.'
			},
			{
				title: 'Games Chatter Voice',
				description:
					'**Games Room #1** (Same for #2): General games voicee chat.\n' +
					'Games listed below the game rooms are game-topic specific but do not require roles to join.'
			},
			{
				title: 'Temp Channels',
				description: 'Need a channel but dont see one to fit your needs? Make your own! See `!codex tempch`.'
			},
			{
				title: 'Misc',
				description:
					'🔒 **Art Gallery**: Members only art/creative den.\n' +
					'🔒 **The Gym**: Members only health/recipe/foodie chat channel.\n' +
					'**Tech Chat**: Chat for technical stuff; PC builds, development, etc.\n' +
					'🔇 **Fishsticks Music Log**: Music log dump for Fishsticks (Please use Rhythm here if applicable).\n' +
					'🔇🔒 **Fishsticks System Log** Live logging console of Fishsticks activity.\n' +
					'**Fishsticks Console**: ' + fishsticks.ranger + 's testing zone. Be careful in here.\n' +
					'🔒 **Conference Room**: Members only chat.\n' +
					'🔒 **Bot Logger**: Logger bot output.\n' +
					'🔒 **Altdentifier Log**: Altys log output.\n' +
					'**(V) Art Gallery**: Voice for Art Gallery.\n' +
					'**(V) Conference Room**: Voice for Conference Room.\n' +
					'**AFK (Someting in here)**: The AFK channel.'
			}
		]
	};

	cmd.msg.channel.send({ embed: embedBuilder(channelsPanel) }).then(sent => sent.delete({ timeout: channelsPanel.delete }));
}

function help() {
	return 'Displays a list of the descriptions of all channels.';
}