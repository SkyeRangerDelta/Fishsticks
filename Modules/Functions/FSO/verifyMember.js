//----FSO VERIFY MEMBER----

const syslogfunc = require('../syslog.js');
const query = require('../db/query.js');

exports.run = async (fishsticks, member) => {

	function syslog(message, level) {
		syslogfunc.run(fishsticks, message, level);
	}

	syslog("[FS-ONLINE] Verifying member record...", 2);

	let memberStandardNickname = member.user.tag.substring(0, member.user.tag.length - 5);

	//Process getting member
	let memberResponse = await query.run(fishsticks, `SELECT 1 FROM fs_members WHERE memberDiscordID = ${member.id};`);
	//If member doesn't exist, create the record
	if (memberResponse[0] == null || memberResponse == undefined) {
		syslog("[FS-ONLINE] Creating new member record with values...\n\tDiscord ID: " + member.id + "\n\tNickname: " + memberStandardNickname + "\n\tTag: " + member.user.tag, 2);
		let memberCreation = await query.run(fishsticks, `INSERT INTO fs_members (memberDiscordID, memberNickname, memberTag, commandsIssued, commandsSucceeded, passivesSucceeded, suggestionsPosted) VALUES (${member.id}, '${memberStandardNickname}', '${member.user.tag}', 0, 0, 0, 0);`);
	}

	syslog("[FS-ONLINE] Verification complete.", 2);
}