//INITIALIZE STORED POLLS

const fs = require('fs');

exports.run = (fishsticks, flag) => {

    let pollFile = JSON.parse(fs.readFileSync("polls.json", 'utf8'));

    if (flag == "init") {
        //Init poll IDs
        for (poll in pollFile.polls) {
            fishsticks.currentPolls.push(pollFile.polls[poll].pollID);
            syslog(fishsticks, "[POLL-SYS] Initialized Poll ID " + pollFile.polls[poll].pollID);

        }
    }

    //SYSTEM LOGGER
    function syslog(message, level) {
		try {
			log.run(fishsticks, message, level);
		}
		catch (err) {
			systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
		}
	}

}