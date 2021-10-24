//----POLL----
//Create and manage polls

//Imports
const Discord = require('discord.js');
const config = require('../../Modules/Core/Core_config.json');
const { log } = require('../../Modules/Utility/Utils_Log');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');

//Variables
const responseEmojis = require('../../Modules/Library/emojiList');
const { MessageButton, MessageActionRow } = require('discord.js');

//Exports
module.exports = {
    run,
    handleAddedReaction,
    help
};

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete();

    if (!hasPerms(cmd.msg.member, ['CC Member', 'ACC Member'])) {
        return cmd.reply('Only members can post polls!', 10);
    }

    //For the sake of aesthetic
    for (const parameter in cmd.content) {
        cmd.content[parameter] = cmd.content[parameter].charAt(0).toUpperCase() + cmd.content[parameter].substring(1, cmd.content[parameter].length);
    }

    const cmdPoll = cmd.content;
    const question = cmdPoll[0];

    let memberType = 'CC Member';
    let opCount = 0;

    try {
        if (hasPerms(cmd.msg.member, ['Council Member'])) {
            memberType = 'Council Member';
        }
        else if (hasPerms(cmd.msg.member, ['Council Advisor'])) {
            memberType = 'Council Advisor';
        }
        else if (hasPerms(cmd.msg.member, ['Staff Member'])) {
            memberType = 'Staff Member';
        }
        else if (hasPerms(cmd.msg.member, ['Moderator'])) {
            memberType = 'Moderator';
        }
    }
    catch (roleFindErr) {
        log('warn', '[POLL-SYS] I couldnt find the role of a member trying to post a poll!\n\n' + roleFindErr);
    }

    let desc = 'A poll has been posted by a ' + memberType + '. To answer the poll, please click one **ONE** of the emoji reactions below this message that corresponds with your answer. Do not vote twice.\n\n';

    try {
        if (cmdPoll[1] == null) {
            return cmd.reply('You need to have at least two poll responses!', 10);
        }
        else if (cmdPoll[1] != null) {

            desc = desc + responseEmojis[1] + ' ' + cmdPoll[1] + '\n';
            opCount++;

            if (cmdPoll[2] == null) {
                return cmd.reply('You need to have at least two poll responses!', 10);
            }
            else if (cmdPoll[2] != null) {

                desc = desc + responseEmojis[2] + ' ' + cmdPoll[2] + '\n';
                opCount++;

                if (cmdPoll[3] != null) {
                    desc = desc + responseEmojis[3] + ' ' + cmdPoll[3] + '\n';
                    opCount++;

                    if (cmdPoll[4] != null) {
                        desc = desc + responseEmojis[4] + ' ' + cmdPoll[4] + '\n';
                        opCount++;

                        if (cmdPoll[5] != null) {
                            desc = desc + responseEmojis[5] + ' ' + cmdPoll[5] + '\n';
                            opCount++;
                        }
                    }
                }
            }
        }
    }
    catch (error) {
        cmd.reply('Ive just caught a glitch in sector 5 of the neural net. I dont know what you did - but you probably should stop.\n' + error, 10);

        return log('warn', '[POLL-SYS] An unknown error has been caught somewhere in response construction.\n' + error);
    }

    const pollQuestion = new Discord.MessageEmbed();
        pollQuestion.setTitle('[POLL!] ' + question);
        pollQuestion.setColor(config.colors.primary);
        pollQuestion.setDescription(desc);

    try {
        const pollToSend = await cmd.channel.send({ embeds: [pollQuestion] });
        const resTypes = [];

        try {
            const responseRow = new MessageActionRow()

            for (let t = 1; t < opCount + 1; t++) {
                responseRow.addComponents(
                    new MessageButton()
                        .setCustomId(`${t}`)
                        .setStyle('PRIMARY')
                        .setLabel(cmdPoll[t])
                        .setEmoji(responseEmojis[t])
                );
            }

            await pollToSend.reply({ content: 'Applicable answers:', components: [responseRow] });
            //await pollToSend.react(responseEmojis[t]);
            log('info', '[POLL-SYS] Adding reaction: ' + responseEmojis[t]);
            resTypes.push(responseEmojis[t]);
        }
        catch (error) {
            log('err', '[POLL-SYS] Some funk has occurred.\n' + error);
        }

        const newPoll = {
            id: pollToSend.id,
            chId: cmd.channel.id,
            responseTypes: resTypes,
            respondents: []
        };

        log('info', '[POLL-SYS] Attempting to create new poll with this object:');

        const FSORes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'insert', newPoll);

        if (FSORes.acknowledged === true) {
            log('proc', '[POLL-SYS] A new poll has been posted and saved to FSO.');
            cmd.reply('Poll saved successfully.', 10);
            fishsticks.pollCache += 1;
        }
        else {
            log('err', '[POLL-SYS] FSO poll insertion failed.');
            throw 'Unknown insertion error.';
        }
    }
    catch (postErr) {
        log('err', '[POLL SYS] An error occured when trying to post the poll. \n\n' + postErr);
        return cmd.reply('Poll posting failed...did you change something you shouldnt have?');
    }
}

function help() {
    return 'Allows you to post polls.';
}

async function handleAddedReaction(fishsticks, addedReaction, reactor, poll) {
    log('info', '[POLL] Incoming poll reaction.');
    //Response was added to a poll

    //Check if the emoji added is legit
    let invalid = true;
    for (const emoji in poll.responseTypes) {
        log('info', `[POLL] Comparing reaction ${addedReaction.emoji.toString()} to ${poll.responseTypes[emoji]}`);
        if (addedReaction.emoji.toString() === poll.responseTypes[emoji]) {
            invalid = false;
        }
    }

    if (invalid) {
        return addedReaction.message.channel.send(`${reactor}, that is not a valid response type.`)
            .then(async sent => {
                await addedReaction.users.remove(reactor.id);
                setTimeout(() => sent.delete(), 5000);
            });
    }

    //Determine if respondent has already voted
    for (const id in poll.respondents) {
        if (reactor.id === poll.respondents[id]) {
            await addedReaction.users.remove(reactor.id); //Remove response
            return addedReaction.message.channel.send(`${reactor}, you can't vote twice!`)
                .then(sent => setTimeout(() => sent.delete(), 5000));
        }
    }

    poll.respondents.push(reactor.id);
    const respondentUpdate = {
        $set: {
            respondents: poll.respondents
        }
    };

    //New respondent
    const newResponderRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'update', respondentUpdate, { id: poll.id });

    if (newResponderRes.modifiedCount !== 1) {
        return addedReaction.channel.send(fishsticks.RANGER + ' Something is WRONG!');
    }
}