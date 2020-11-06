//----POLL----
//Create and manage polls

//Imports
const Discord = require('discord.js');
const config = require('../../Modules/Core/Core_config.json');
const { log } = require('../../Modules/Utility/Utils_Log');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');

//Variables
const responseEmojis = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"];

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete({timeout: 0});

    if (!hasPerms(cmd.msg.member, ['CC Member', 'ACC Member'])) {
        return cmd.msg.reply('Only members can post polls!').then(sent => sent.delete({ timeout: 10000 }));
    }

    let cmdPoll = cmd.content;

    let question = cmdPoll[0];

    let memberType = "CC Member";
    let opCount = 0;

    try {
        if (hasPerms(cmd.msg.member, ["Council Member"])) {
            memberType = "Council Member";
        }
        else if (hasPerms(cmd.msg.member, ["Council Advisor"])) {
            memberType = "Council Advisor";
        }
        else if (hasPerms(cmd.msg.member, ["Staff Member"])) {
            memberType = "Staff Member";
        }
        else if (hasPerms(cmd.msg.member, ["Moderator"])) {
            memberType = "Moderator";
        }
    }
    catch (roleFindErr) {
        log('warn', `[POLL-SYS] I couldn't find the role of a member trying to post a poll!\n\n` + roleFindErr);
    }

    let desc = "A poll has been posted by a " + memberType + ". To answer the poll, please click one **ONE** of the emoji reactions below this message that corresponds with your answer. Do not vote twice.\n\n";

    try {
        if (cmdPoll[1] == null) {
            return cmd.msg.reply("You need to have at least two poll responses!");
        }
        else if (cmdPoll[1] != null) {

            desc = desc + responseEmojis[0] + " " + cmdPoll[1] + "\n";
            opCount++;

            if (cmdPoll[2] == null) {
                return cmd.msg.reply("You need to have at least two poll responses!");
            }
            else if (cmdPoll[2] != null) {

                desc = desc + responseEmojis[1] + " " + cmdPoll[2] + "\n";
                opCount++;

                if (cmdPoll[3] != null) {
                    desc = desc + responseEmojis[2] + " " + cmdPoll[3] + "\n";
                    opCount++;

                    if (cmdPoll[4] != null) {
                        desc = desc + responseEmojis[3] + " " + cmdPoll[4] + "\n";
                        opCount++;

                        if (cmdPoll[5] != null) {
                            desc = desc + responseEmojis[4] + " " + cmdPoll[5] + "\n";
                            opCount++;

                            if (cmdPoll[6] != null) {
                                desc = desc + responseEmojis[5] + " " + cmdPoll[6] + "\n";
                                opCount++;

                                if (cmdPoll[7] != null) {
                                    desc = desc + responseEmojis[6] + " " + cmdPoll[7] + "\n";
                                    opCount++;

                                    if (cmdPoll[8] != null) {
                                        desc = desc + responseEmojis[7] + " " + cmdPoll[8] + "\n";
                                        opCount++;

                                        if (cmdPoll[9] != null) {
                                            desc = desc + responseEmojis[8] + " " + cmdPoll[9] + "\n";
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
        cmd.msg.reply("I've just caught a glitch in sector 5 of the neural net. I don't know what you did - but you probably should stop.\n" + error).then(sent => sent.delete({timeout: 10000}));
        return log('warn', '[POLL-SYS] An unknown error has been caught somewhere in response construction.\n' + error);
    }

    let pollQuestion = new Discord.MessageEmbed();
        pollQuestion.setTitle("[POLL!] " + question);
        pollQuestion.setColor(config.colors.primary);
        pollQuestion.setDescription(desc);

    try {
        const pollToSend = await cmd.msg.channel.send({embed: pollQuestion});

        for (let t = 0; t < opCount; t++) {
            try {
                await pollToSend.react(responseEmojis[t]);
                log('info', '[POLL-SYS] Adding reaction: ' + responseEmojis[t]);
            } catch (error) {
                log('err', '[POLL-SYS] Some funk has occurred.\n' + error);
            }
        }

        let newPoll = {
            id: pollToSend.id,
            numOptions: opCount,
            respondents: []
        };

        log('info', '[POLL-SYS] Attempting to create new poll with this object:');
        console.log(newPoll);

        let FSORes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Polls', 'insert', newPoll);

        if (FSORes.inserted == 1) {
            log('proc', '[POLL-SYS] A new poll has been posted and saved to FSO.');
            cmd.msg.reply("Poll saved successfully.").then(sent => sent.delete({timeout: 10000}));
        } else {
            log('err', '[POLL-SYS] FSO poll insertion failed.');
            throw 'Unknown insertion error.';
        }
    }
    catch (postErr) {
        log('err', '[POLL SYS] An error occured when trying to post the poll. \n\n' + postErr);
        return cmd.msg.reply("Poll posting failed...did you change something you shouldn't have?");
    }
}

function help() {
    return 'Allows you to post polls.';
}