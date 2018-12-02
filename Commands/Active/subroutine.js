const subroutesFunc = require('../../Modules/Functions/subRoutines.js');
const conColor = require('colors');
const log = require('../../Modules/Functions/log.js');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //LOGGER
    function syslog(message, level) {
		try {
			log.run(fishsticks, message, level);
		}
		catch (err) {
			systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
		}
	}

    let toggle = cmd[0].toLowerCase();
    let systemRoutine = cmd[1];

    let reject = ["Oooh, trying to play with fire are we?", "No no no, I can't let you do that.", "I'm sorry Dave, I can't do that.", "Stop that."];
    let rejectNum = (Math.random() * reject.length);

    console.log(conColor.red("[*SUBR-CON*] Received Subroutine Control Toggle Request.\n[*SUBR-CON*] Toggle/System Subroutine: " + toggle + " / " + systemRoutine));
    syslog("[*SUBR-CON*] Received Subroutine Control Toggle Request.\n[*SUBR-CON*] Toggle/System Subroutine: " + toggle + " / " + systemRoutine, 3);

    permsCheck();

    function checkToggle() { //Check the subroutine map
        if (fishsticks.subroutines.has(systemRoutine)) {
            if (fishsticks.subroutines.get(systemRoutine)) {
                return true;
                //Was enabled
            }
            else {
                return false;
                //Was disabled
            }
        }
        else {
            console.log(conColor.red("[*SUBR-CON*] Couldn't find specified subroutine."));
            syslog("[*SUBR-CON*] Couldn't find specified subroutine.", 3);
            return msg.reply("What subroutine is that?");
        }
    }

    function result() { //Actually toggle subroutine
        if (toggle == "enable") {
            if (checkToggle() == true) {
                console.log(conColor.red("[*SUBR-CON*] Subroutine was found already running."));
                syslog("[*SUBR-CON*] Received Subroutine Control Toggle Request.\n[*SUBR-CON*] Toggle/System Subroutine: " + toggle + " / " + systemRoutine, 3);
                return msg.reply("This subroutine is already running!");
            }
            else if (checkToggle() == false) {
                fishsticks.subroutines.set(systemRoutine, true);
                console.log(conColor.red("[*SUBR_CON*] Subroutine: " + systemRoutine + " has been enabled by " + msg.author.tag));
                syslog("[*SUBR_CON*] Subroutine: " + systemRoutine + " has been enabled by " + msg.author.tag, 3);
                return msg.reply("Subroutine " + systemRoutine + " enabled.").then(sent => sent.delete(20000));
            }
            else {
                return;
            }
        }
        else if (toggle == "disable") {
            if (checkToggle() == true) {
                fishsticks.subroutines.set(systemRoutine, false);
                console.log(conColor.red("[*SUBR_CON*] Subroutine: " + systemRoutine + " has been disabled by " + msg.author.tag));
                syslog("[*SUBR_CON*] Subroutine: " + systemRoutine + " has been disabled by " + msg.author.tag, 3);
                return msg.reply("Subroutine " + systemRoutine + " disabled.").then(sent => sent.delete(20000)); 
            }
            else if (checkToggle() == false) {
                console.log(conColor.red("[*SUBR-CON*] Subroutine was found already disabled."));
                syslog("[*SUBR-CON*] Subroutine was found already disabled.", 3);
                return msg.reply("This subroutine is already disabled!");
            }
            else {
                return;
            }
        }
        else {
            console.log(conColor.red("[*SUBR-CON*] Improper toggle parameter. Rejected."));
            syslog("[*SUBR-CON*] Improper toggle parameter. Rejected.", 3);
            return msg.reply("That's not a proper parameter type!").then(sent => sent.delete(10000));
        }
    }

    async function permsCheck() {
        if (msg.member.roles.find("name", "Staff")) {
            if (cmd[2] == "active") {
                if (msg.author.id == fishsticks.ranger.id) {
                    msg.reply("ALPHA LEVEL COMMAND: Subroutine clearance allowed.").then(sent => sent.delete(15000));
                    result();
                }
                else {
                    msg.reply(reject[rejectNum]);
                }
            }
            else {

                if (msg.author.id == fishsticks.ranger.id) {
                    result();
                }
                else {
                    msg.reply("I'd be very careful with what you're toying with.").then(sent => sent.delete(15000));
                    msg.channel.send("To confirm the change, type exactly this: `confirm change`.");

                    var confirm;

                    try {
                        confirm = await msg.channel.awaitMessages(msg2 => msg2.content == "confirm change", {
                            maxMatches: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (error) {
                        console.log(conColor.red("[*SUBR-CON*] " + msg.author.username + " timed out in confirming a subroutine change."));
                        syslog("[*SUBR-CON*] " + msg.author.username + " timed out in confirming a subroutine change.", 3);
                        msg.reply("You didn't confirm the change, negating request.").then(sent => sent.delete(15000));
                    }

                    if (confirm) {
                       return result();
                    }
                    else {
                        msg.reply("Subroutine change negated.").then(sent => sent.delete(15000));
                    }
                }
            }
        }
        else {
            msg.reply("Hands off mate!");
        }
    }
}