const ids = require('../../Modules/fs_ids.json');
const fs = require('fs');

const log = require('../../Modules/Functions/log.js');

exports.run = async (fishsticks, msg, cmd) => {
	msg.delete({timeout: 0});

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
            return msg.reply("You're not trusted enough to vouch for someone!").then(sent => sent.delete({timeout: 15000}));
        }
    }
    else {
        return msg.reply("The vouch subroutine is currently disabled. Get a staff member to turn it on!");
    }

    async function runCmd() {
        //COMMAND
        let recognized = msg.guild.roles.find('name', 'Recognized');
        let vouchee = msg.author.id;
        let userID = cmd[0].replace(/[\\<>@#&!]/g, "");
        let userToVouch = fishsticks.users.cache.get(userID);
        let vouchedFor = false;

        msg.guild.fetchMember(userToVouch).then(mem => {
            if (mem.roles.find("name", "Recognized")) {
                msg.reply("Why are you vouching for someone who is already Recognized? Don't be dumb. :facepalm:").then(sent => sent.delete({timeout: 20000}));
                return;
            }
        });

        syslog("Received a vouch command from " + msg.author.username + " for " + userToVouch.username, 2);

        var vouchesFile = JSON.parse(fs.readFileSync('./Modules/Vouches/fs_vouches.json', 'utf8'));
        
        //Attempt to read keys
        try {
            for (i in vouchesFile.vouches) {
                if (vouchesFile.vouches[i].userID == userID) { //Found a key
                    if (vouchesFile.vouches[i].vouches == 1) { //Check for an already existing vouch

                        for (t in vouchesFile.vouches[i].userIDs) { //If the voucher has already vouched for the vouchee
                            if (vouchesFile.vouches[i].userIDs[t] == msg.author.id) {
                                return msg.reply("You can't vouch for the same person twice! Get outta here...").then(sent => sent.delete({timeout: 15000}));
                            }
                        }

                        vouchesFile.vouches[i].vouches++;
                        vouchesFile.vouches[i].userIDs.push(msg.author.id);
                        msg.reply("You've vouched for " + userToVouch.username + "! Granting them Recognized!").then(sent => sent.delete({timeout: 10000}));
                        msg.channel.send(userToVouch.username + " has been granted Recognized.");
                        msg.guild.fetchMember(userToVouch).then(vouchPerson => {
                            vouchPerson.addRole(recognized);

                            //Send member a game watcher request
                            vouchPerson.send("Now that you're a recognized member of our Discord, I'd like to point out that we have a multiude of game-specific channels in here."+
                            " Some of them are hidden (text chats) but the voice chats are always open. You can see **all** of these text chats (and get a better idea of what all we"+
                            " play by joining the game watcher role (which you can remove any time if you don't want it). I can assign this to you now if you'd like. Just click the check below if so.").then(gwDM => {
                                gwDM.react('✅');
                                fishsticks.gwDMMessages.push(gwDM.id);
                            });
                        });
                        syslog("[VOUCH SYS] Granted Recognized to " + userToVouch.tag + " due to receiving 2 vouches.", 2);
                        vouchedFor = true;
                    }
                    else {
                        msg.reply(userToVouch.username + " has already received 2 vouches! He doesn't need anymore and should already be recognized. If not, ask a staff member!");
                        return;
                    }
                }
            }

            if (vouchedFor == false) {
                //Didn't find a key, therefore create one
                let newKey = {"userID": userToVouch.id, "vouches": 1, "userIDs":[]};
                vouchesFile.vouches.push(newKey);
                vouchesFile.vouches[vouchesFile.vouches.length - 1].userIDs.push(msg.author.id);
                msg.reply("You've vouched for " + userToVouch.username + "! They need another vouch before they're granted Recognized!");
            }
        }
        catch (err) {
            syslog("[VOUCH SYS] SOMETHING IS ON FIRE. WHY IS THIS ON FIRE? THIS IS *NEVER ON FIRE*.", 3);
        }

        fs.writeFileSync('./Modules/Vouches/fs_vouches.json', JSON.stringify(vouchesFile));
    }


    
}