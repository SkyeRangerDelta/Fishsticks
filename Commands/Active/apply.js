// ---- APPLY ----
//Join (A)CC Membership

//Imports
const { introduction, formQuestions } = require('../../Modules/Library/appQuestions.json');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { primary } = require('../../Modules/Core/Core_config.json').colors;

//Exports
module.exports = {
	run,
	help,
	startApp
};

//Functions
function run(fishsticks, cmd) {

	//Not done
	return cmd.msg.reply('This command aint done just yet. You can still apply for membership via this link: https://bit.ly/CCMemberApp');

	//Dispatch introduction embed
	const introPanel = {
		title: 'o0o - Christian Crew Membership Application - o0o',
		description: introduction,
		color: primary,
		footer: 'If you did not issue this command, or no longer wish to continue; please type `stop` at any time.',
	};

	cmd.msg.author.send({ embeds: embedBuilder(introPanel) })
	.then(cmd.msg.author.send('If you are ready to begin, please click the green check emoji to start.'))
	.then(sent => {
		sent.react('✅');
		fishsticks.appMsgIDs.push(sent.id);
	});
}

function help() {
	return 'Starts the (A)CC application process.';
}

//Begin the application process
function startApp(fishsticks, msg) {
	msg.author.send('Alright then, let us begin. Pleae note that your answers in this thing are accepted as SOON as you hit ENTER and post them. You may go back a (single) question to resubmit it by typing `back` at any time.');

	let qNumber = 0;

	msg.author.send(formQuestions[qNumber]).then(qNumber++);
}