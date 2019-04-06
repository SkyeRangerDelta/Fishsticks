const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const coresys = require('../../Modules/Core/coresys.json');
const fs = require('fs');

const log = require('../../Modules/Functions/log.js');

exports.run = (fishsticks, msg, cmd) => {
	msg.delete();

    //LOGGER INITIALZE
	function syslog(message, level) {
		try {
			log.run(fishsticks, message, level);
		}
		catch (err) {
			systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Vouch)\n\nDetailing:\n" + err);
		}
    }

    //PERMISSIONS CHECK
    if (fishsticks.subroutines.get("vouch")) {
        if (msg.member.roles.find("name", "CC Member") || msg.member.roles.find("name", "ACC Member")) {
            runCmd();
        }
        else {
            return msg.reply("You're not trusted enough to vouch for someone!").then(sent => sent.delete(15000));
        }
    }
    else {
        return msg.reply("The vouch subroutine is currently disabled. Get a staff member to turn it on!");
    }

    function runCmd() {
        //COMMAND
        let recognized = msg.guild.roles.find('name', 'Recognized');
        let vouchee = msg.author.id;
        let userID = cmd[0].replace(/[\\<>@#&!]/g, "");
        let userToVouch = fishsticks.users.get(userID);
        let vouchedFor = false;

        msg.guild.fetchMember(userToVouch).then(mem => {
            if (mem.roles.find("name", "Recognized")) {
                msg.reply("Why are you vouching for someone who is already Recognized? Don't be dumb. :facepalm:").then(sent => sent.delete(20000));
                return;
            }
        });

        console.log("Received a vouch command from " + msg.author.username + " for " + userToVouch.username);
        syslog("Received a vouch command from " + msg.author.username + " for " + userToVouch.username, 2);

        var vouchesFile = JSON.parse(fs.readFileSync('./Modules/Vouches/fs_vouches.json', 'utf8'));
        
        //Attempt to read keys
        try {
            for (i in vouchesFile.vouches) {
                if (vouchesFile.vouches[i].userID == userID) { //Found a key
                    if (vouchesFile.vouches[i].vouches == 1) { //Check for an already existing vouch

                        for (t in vouchesFile.vouches[i].userIDs) { //If the voucher has already vouched for the vouchee
                            if (vouchesFile.vouches[i].userIDs[t] == msg.author.id) {
                                return msg.reply("You can't vouch for the same person twice! Get outta here...").then(sent => sent.delete(15000));
                            }
                        }

                        vouchesFile.vouches[i].vouches++;
                        vouchesFile.vouches[i].userIDs.push(msg.author.id);
                        msg.reply("You've vouched for " + userToVouch.username + "! Granting them Recognized!").then(sent => sent.delete(10000));
                        msg.guild.fetchMember(userToVouch).then(vouchPerson => vouchPerson.addRole(recognized));
                        console.log("[VOUCH SYS] Granted Recognized to " + userToVouch.tag + " due to receiving 2 vouches.");
                        syslog("[VOUCH SYS] Granted Recognized to " + userToVouch.tag + " due to receiving 2 vouches.", 2);
                        vouchedFor = true;
                    }
                    else {
                        msg.reply(userToVouch.username + " has already received 2 vouches! He doesn't need anymore and should already be recognized. If not, ask a staff member!").then(sent => sent.delete(15000));
                        return;
                    }
                }
            }

            if (vouchedFor == false) {
                //Didn't find a key, therefore create one
                let newKey = {"userID": userToVouch.id, "vouches": 1, "userIDs":[]};
                vouchesFile.vouches.push(newKey);
                vouchesFile.vouches[vouchesFile.vouches.length - 1].userIDs.push(msg.author.id);
                msg.reply("You've vouched for " + userToVouch.username + "! They need another vouch before they're granted Recognized!").then(sent => sent.delete(15000));
            }
        }
        catch (err) {
            console.log("SOMETHING IS ON FIRE.\n" + err);
            syslog("[VOUCH SYS] Granted Recognized to " + userToVouch.tag + " due to receiving 2 vouches.", 3);
        }

        fs.writeFileSync('./Modules/Vouches/fs_vouches.json', JSON.stringify(vouchesFile));
    }


    
}