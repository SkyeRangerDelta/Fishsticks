//---- NEW JOIN HANDLER ----
// Handles a newcomer (not Recognized member) to the server object

//Imports
const { welcomeDM, welcomeBlurb1, welcomeBlurb2 } = require('../Library/systemResponses.json');
const { cPad } = require('../Core/Core_ids.json');
const { systemTimestamp } = require('../Utility/Utils_Time');

//Exports
module.exports = {
	handleNewJoin
};

//Functions
function handleNewJoin(fishsticks, newJoin) {
	//Dispatch Welcome/Intro DM
	newJoin.sendMessage(welcomeDM);

	//Dispatch Welcome Embed
	const cPadEmbedPanel = {
		title: `o0o - Welcome, ${newJoin.nickname}!`,
		description: welcomeBlurb1 + fishsticks.RANGER + welcomeBlurb2,
		footer: `${newJoin.nickname} joined at ${systemTimestamp}.`,
		fields: [
			{
				name: `Welcome to the official CC Discord, ${newJoin.nickname}!`,
				value: 'Stick around for some Fish!'
			}
		]
	};

	const cPadCh = fishsticks.channels.cache.get(cPad);
	cPadCh.send(cPadEmbedPanel);
}