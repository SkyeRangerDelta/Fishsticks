const subroutesFunc = require('../../Modules/Functions/subRoutines.js');
const conColor = require('colors');
const syslog = require('../../Modules/Functions/syslog.js');
const subroutinesCheck = require('../../Modules/Functions/subroutineCheck.js');
const query = require('../../Modules/Functions/db/query.js');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    let toggle = cmd[0].toLowerCase();
    let systemRoutine = cmd[1];

    let reject = ["Oooh, trying to play with fire are we?", "No no no, I can't let you do that.", "I'm sorry Dave, I can't do that.", "Stop that."];
    let rejectNum = (Math.random() * reject.length);

    syslog.run(fishsticks, "[*SUBR-CON*] Received Subroutine Control Toggle Request.\n[*SUBR-CON*] Toggle/System Subroutine: " + toggle + " / " + systemRoutine, 3);

    permsCheck();

    async function checkToggle() { //Check the subroutine map

        let routineResponse;

        try {
            routineResponse = await query.run(fishsticks, `SELECT state FROM fs_subroutines WHERE name = '${systemRoutine}';`);
        } catch (dbError) {
            syslog.run(fishsticks, "[*SUBR-CON*] Subroutine not found. Command negated.");
            return msg.reply("That's not a subroutine! Perhaps you should check the [wiki page](https://wiki.pldyn.net/fishsticks/subroutines).");
        }

        //Analyze reponse
        if (routineResponse[0].state == 0) {
            syslog.run(fishsticks, "[*SUBR-CON*] Primary Check finished, state was false.", 2);
            return false;
        } else if (routineResponse[0].state == 1) {
            syslog.run(fishsticks, "[*SUBR-CON*] Primary Check finished, state was true.", 2);
            return true;
        } else {
            return msg.reply("Is FSO down? Somethings funky with the database!" + fishsticks.ranger);
        }
    }

    async function result() { //Actually toggle subroutine
        if (toggle == "enable") {
            if ( await checkToggle() == true) {
                syslog.run(fishsticks, "[*SUBR-CON*] Received Subroutine Control Toggle Request.\n[*SUBR-CON*] Toggle/System Subroutine: " + toggle + " / " + systemRoutine, 3);
                syslog.run(fishsticks, "[*SUBR-CON*] Subroutine was already running!", 2);
                return msg.reply("This subroutine is already running!");
            }
            else if (await checkToggle() == false) {
                let response = await query.run(fishsticks, `UPDATE fs_subroutines SET state = 1 WHERE name = '${systemRoutine}';`);


                //fishsticks.subroutines.set(systemRoutine, true);
                syslog.run(fishsticks, "[*SUBR_CON*] Subroutine: " + systemRoutine + " has been enabled by " + msg.author.tag, 3);
                return msg.reply("Subroutine " + systemRoutine + " enabled.").then(sent => sent.delete({timeout: 20000}));
            }
            else {
                return;
            }
        }
        else if (toggle == "disable") {
            if (await checkToggle() == true) {
                let response = await query.run(fishsticks, `UPDATE fs_subroutines SET state = 0 WHERE name = '${systemRoutine}';`);

                //fishsticks.subroutines.set(systemRoutine, false);
                syslog.run(fishsticks, "[*SUBR_CON*] Subroutine: " + systemRoutine + " has been disabled by " + msg.author.tag, 3);
                return msg.reply("Subroutine " + systemRoutine + " disabled.").then(sent => sent.delete({timeout: 20000})); 
            }
            else if (await checkToggle() == false) {
                syslog.run(fishsticks, "[*SUBR-CON*] Subroutine was found already disabled.", 3);
                return msg.reply("This subroutine is already disabled!");
            }
            else {
                return;
            }
        }
        else {
            syslog.run(fishsticks, "[*SUBR-CON*] Improper toggle parameter. Rejected.", 3);
            return msg.reply("That's not a proper state change! Must be `enable` or `disable`.").then(sent => sent.delete({timeout: 10000}));
        }
    }

    async function permsCheck() {
        if (msg.member.roles.find("name", "Staff")) {
            if (cmd[2] == "active") {
                if (msg.author.id == fishsticks.ranger.id) {
                    msg.reply("ALPHA LEVEL COMMAND: Subroutine clearance allowed.").then(sent => sent.delete({timeout: 15000}));
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
                    msg.reply("I'd be very careful with what you're toying with.").then(sent => sent.delete({timeout: 15000}));
                    msg.channel.send("To confirm the change, type exactly this: `confirm change`.");

                    var confirm;

                    try {
                        confirm = await msg.channel.awaitMessages(msg2 => msg2.content == "confirm change", {
                            maxMatches: 1,
                            time: 10000,
                            errors: ['time']
                        });
                    } catch (error) {
                        syslog.run(fishsticks, "[*SUBR-CON*] " + msg.author.username + " timed out in confirming a subroutine change.", 3);
                        msg.reply("You didn't confirm the change, negating request.").then(sent => sent.delete({timeout: 15000}));
                    }

                    if (confirm) {
                       return result();
                    }
                    else {
                        msg.reply("Subroutine change negated.").then(sent => sent.delete({timeout: 15000}));
                    }
                }
            }
        }
        else {
            msg.reply("Hands off mate!");
        }
    }
}