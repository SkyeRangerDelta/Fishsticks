const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const coresys = require('../../Modules/Core/coresys.json');
const log = require('../../Modules/Functions/log.js');

exports.run = (fishsticks, msg, cmd) => {
    //LOGGER INITIALZE
	function syslog(message, level) {
		try {
			log.run(fishsticks, message, level);
		}
		catch (err) {
			systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
		}
	}

    let type = cmd[0];
    console.log("Passive - Fire -> Type: " + type);
    syslog("Passive - Fire -> Type: " + type, 1);

    switch (type) {
        case "phasers":
            msg.channel.send("**Aye Captain; firing all phaser banks.**", {files: ["./images/phasers.gif"]});
            break;
        case "torpedoes":
            msg.channel.send("**Aye Captain; firing all photon torpedoes.**", {files: ["./images/torpedoes.gif"]});
            break;
        default:
            msg.channel.send("**Aye Captain; firing all weapons.**", {files: ["./images/weapons.gif"]});
            break;
    }
}