const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const emojiList = require('../../Modules/Collections/emojis.js');
const fs = require('fs');
const syslogFunc = require('../../Modules/Functions/syslog.js');

var pollsFile = JSON.parse(fs.readFileSync('./Modules/PollingSystem/polls.json', 'utf8'));

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    function syslog(message, level) {
		syslogFunc.run(message, level);
	}


    if (msg.member.roles.find("name", "CC Member") || msg.member.roles.find("name", "ACC Member")) {
        execute();
    }
    else {
        msg.reply("You don't have permission to post polls!").then(sent => sent.delete(10000));
    }


    function execute() {
        let cmdPoll = msg.content.split("-");

        let question = cmdPoll[1];
        let opA = cmdPoll[2];
        let opB = cmdPoll[3];
        let opC = cmdPoll[4];
        let opD = cmdPoll[5];
        let opE = cmdPoll[6];
        let opF = cmdPoll[7];
        let opG = cmdPoll[8];
        let opH = cmdPoll[9];
        let opI = cmdPoll[10];
    
        let memberType = "CC Member";
        let opCount = 0;
    
        try {
            if (msg.member.roles.find("name", "Council Member")) {
                memberType = "Council Member";
            }
            else if (msg.member.roles.find("name", "Council Advisor")) {
                memberType = "Council Advisor";
            }
            else if (msg.member.roles.find("name", "Staff")) {
                memberType = "Staff Member";
            }
            else if (msg.member.roles.find("name", "Moderator")) {
                memberType = "Moderator";
            }
        }
        catch (roleFindErr) {
            console.log("I couldn't find the role of a member trying to post a poll!\n\n" + roleFindErr);
            syslog("I couldn't find the role of a member trying to post a poll!\n\n" + roleFindErr, 3);
        }
    
        let desc = "A poll has been posted by a " + memberType + ". To answer the poll, please click one **ONE** of the emoji reactions below this message that corresponds with your answer. Do not vote twice.\n\n";
    
        try {
            if (opA == null) {
                return msg.reply("You need to have at least two poll responses!");
            }
            else if (opA != null) {
    
                desc = desc + emojiList["1"] + " " + opA + "\n";
                opCount++;
    
                if (opB == null) {
                    return msg.reply("You need to have at least two poll responses!");
                }
                else if (opB != null) {
    
                    desc = desc + emojiList["2"] + " " + opB + "\n";
                    opCount++;
    
                    if (opC != null) {
                        desc = desc + emojiList["3"] + " " + opC + "\n";
                        opCount++;
    
                        if (opD != null) {
                            desc = desc + emojiList["4"] + " " + opD + "\n";
                            opCount++;
    
                            if (opE != null) {
                                desc = desc + emojiList["5"] + " " + opE + "\n";
                                opCount++;
    
                                if (opF != null) {
                                    desc = desc + emojiList["6"] + " " + opF + "\n";
                                    opCount++;
    
                                    if (opG != null) {
                                        desc = desc + emojiList["7"] + " " + opG + "\n";
                                        opCount++;
    
                                        if (opH != null) {
                                            desc = desc + emojiList["8"] + " " + opH + "\n";
                                            opCount++;
    
                                            if (opI != null) {
                                                desc = desc + emojiList["9"] + " " + opI + "\n";
                                                opCount++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log("[POLL SYS] Something has gone wrong while creating a poll.\n\n" + error);
            syslog("[POLL SYS] Something has gone wrong while creating a poll.\n\n" + error, 3);
        }
    
        let pollQuestion = new Discord.RichEmbed();
            pollQuestion.setTitle("[POLL!] " + question);
            pollQuestion.setColor(config.fsemercolor);
            pollQuestion.setDescription(desc);
    
        try {msg.channel.send({embed: pollQuestion})
            .then(function (post) {
                for (var iter = 0; iter < opCount; iter++) {
                    post.react(reactType(iter));
                    console.log("Adding reaction: " + reactType(iter));
                    syslog("Adding reaction: " + reactType(iter), 1);
                }
    
                fishsticks.currentPolls.push(post.id);
                let newPoll = {"pollID": post.id, "options": opCount, "responders": []};
                pollsFile.polls.push(newPoll);
                fs.writeFileSync('./Modules/PollingSystem/polls.json', JSON.stringify(pollsFile));
    
                console.log("[POLL SYS] A new poll has been posted and saved to the bot.");
                syslog("[POLL SYS] A new poll has been posted and saved to the bot.", 2);
                msg.reply("Poll saved successfully.").then(sent => sent.delete(10000));
            });
        }
        catch (postErr) {
            console.log("[POLL SYS] An error occured when trying to post the poll. \n\n" + postErr);
            syslog("[POLL SYS] An error occured when trying to post the poll. \n\n" + postErr, 3);
        }
    }

    function reactType(count) {
        switch (count) {
            case 0:
                return emojiList["1"];
                break;
            case 1:
                return emojiList["2"];
                break;
            case 2:
                return emojiList["3"];
                break;
            case 3:
                return emojiList["4"];
                break;
            case 4:
                return emojiList["5"];
                break;
            case 5:
                return emojiList["6"];
                break;
            case 6:
                return emojiList["7"];
                break;
            case 7:
                return emojiList["8"];
                break;
            case 8:
                return emojiList["9"];
                break;
            case 9:
                return emojiList["10"];
                break;
            default:
                return emojiList.a;
                break;
        }
    }

}