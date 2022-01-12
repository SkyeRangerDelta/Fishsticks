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
const { fsoValidationException } = require('../../Modules/Errors/fsoValidationException');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

//Exports
module.exports = {
    run,
    handleInteraction,
    help
};

//Globals
let memberType = 'CC Member';

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete();

    //Init
    await handleExecution(cmd);

    //Parse
    const pollData = await parseCmd(fishsticks, cmd);
    if(pollData === -1) {
        return;
    }

    //Post the poll
    const newPollData = await postPoll(cmd, pollData);

    //Send and test res
    const postFSORes = await postFSO(fishsticks, newPollData);

    if (postFSORes !== 1) {
        //Poll posting failed
        throw new fsoValidationException('A poll failed to post to FSO.');
    }
}

//Help
function help() {
    return 'Allows you to post polls.';
}

//Parse Execution Data
function handleExecution(cmd) {
    //Process preliminary

    //Permissions
    if (!hasPerms(cmd.msg.member, ['CC Member', 'ACC Member'])) {
        return cmd.reply('Only members can post polls!', 10);
    }

    //Member type
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
}

//Parse Command
async function parseCmd(fishsticks, cmd) {
    //Determine functional data

    //For the sake of aesthetic
    for (const parameter in cmd.content) {
        cmd.content[parameter] = cmd.content[parameter].charAt(0).toUpperCase() + cmd.content[parameter].substring(1, cmd.content[parameter].length);
    }

    const cmdPoll = cmd.content;

    /*
    New Syntax: !poll [-Question] [-Ans 1] [-Ans 2] <-Ans 3 thru 5>
    0: Question
    1: Ans 1
    2: Ans 2
    3-5: Ans 3-5
     */

    //Setup poll object
    const pollObj = {
        id: null,
        intId: null,
        chId: cmd.channel.id,
        authId: cmd.msg.author.id,
        active: true,
        tied: false,
        q: cmdPoll[0],
        d: null,
        responses: {
            recVotes: 0,
            types: []
        },
        embed: {
            title: '[POLL] ',
            color: config.colors.primary
        }
    };

    //Fill in desc
    pollObj.d = 'A poll has been posted by a ' + memberType + '. To answer the poll, please click one **ONE** of the emoji reactions below this message that corresponds with your answer. Do not vote twice.\n\n';
    pollObj.embed.title += pollObj.q;

    //Verify at least 2 answer choices
    if (!cmdPoll[1] || !cmdPoll[2]) {
        cmd.reply('There has to be at least 2 responses!', 10);
        return -1;
    }

    //Go through parameters filling in answers
    try {
        for (let i = 1; i < cmdPoll.length; i++) {
            if (i < 5) {
                //Ans is not the question
                pollObj.d += `${responseEmojis[i]} ${cmdPoll[i]} \n`;
                pollObj.responses.types.push({
                    d: cmdPoll[i],
                    cid: `POLL-${i - 1}`,
                    ids: []
                });
            }
            else {
                return cmd.reply('A poll cannot have more than 4 responses!', 10);
            }
        }
    }
    catch (err) {
        cmd.reply('Ive just caught a glitch in sector 5 of the neural net. I dont know what you did - but you probably should stop.\n' + err, 10);

        return log('warn', '[POLL-SYS] An unknown error has been caught somewhere in response construction.\n' + err);
    }

    return pollObj;
}

//Post FSO Data
async function postFSO(fishsticks, pollData) {
    //Send poll
    const pollPostRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'insert', pollData);

    console.log(pollPostRes);

    //Validate res
    if (pollPostRes.acknowledged) {
        return 1;
    }
    else {
        return -1;
    }
}

//Post Message
async function postPoll(cmd, pollObj) {
    //Build embed
    const pollQuestion = new Discord.MessageEmbed()
        .setTitle(pollObj.embed.title)
        .setColor(pollObj.embed.color)
        .setDescription(pollObj.d);

    //Compose action row
    const resRow = new MessageActionRow();

    //Response buttons
    for (let r = 0; r <= pollObj.responses.types.length - 1; r++) {
        resRow.addComponents(
            new MessageButton()
                .setCustomId(`POLL-${r}`)
                .setStyle('PRIMARY')
                .setLabel(pollObj.responses.types[r].d)
                .setEmoji(responseEmojis[r + 1])
        );
    }

    //End poll button
    resRow.addComponents(
        new MessageButton()
            .setCustomId('POLL-A')
            .setStyle('DANGER')
            .setLabel('End Poll')
            .setEmoji('✅')
    );

    //Dispatch message and set FSO obj id to msg
    const pollMsg = await cmd.channel.send({ content: 'A question has been asked!', embeds: [pollQuestion], components: [resRow] });
    pollObj.id = pollMsg.id;

    return pollObj;
}

//Process Interaction
async function handleInteraction(fishsticks, interaction) {
    const pollRecord = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'select', { id: interaction.message.id });

    if (pollRecord.active === false) {
        return interaction.reply({ content: 'This poll has ended!', ephemeral: true });
    }

    if (interaction.component.customId === 'POLL-A') {
        //End poll received
        return endPoll(fishsticks, pollRecord, interaction);
    }
    else if (interaction.component.customId === 'POLL-E') {
        //Confirm end poll with tie
        return endPoll(fishsticks, pollRecord, interaction);
    }

    const dupe = dupeCheck(pollRecord, interaction.member.id);

    if (dupe) {
        updateResponse(fishsticks, pollRecord, interaction);
    }
    else {
        addResponse(fishsticks, pollRecord, interaction);
    }

}

//Add Response
async function addResponse(fishsticks, pollObj, interaction) {

    const aRes = await fishsticks.FSO_CONNECTION.db('FishsticksOnline').collection('FSO_Polls').updateOne({
        id: interaction.message.id,
        'responses.types.cid': interaction.component.customId
    }, {
        $push: {
            'responses.types.$.ids': interaction.member.id
        },
        $inc: {
            'responses.recVotes': 1
        }
    });

    const pollEmbed = new Discord.MessageEmbed()
        .setTitle(pollObj.embed.title)
        .setColor(pollObj.embed.color)
        .setDescription(pollObj.d + '\nVotes: `' + (pollObj.responses.recVotes + 1) + '`.');

    //TODO: Increment votes
    interaction.message.edit({ embeds: [pollEmbed] });

    if (aRes.modifiedCount === 1) {
        interaction.reply({ content: 'Response noted.', ephemeral: true });
    }
    else {
        interaction.reply({ content: '**Response failed!**', ephemeral: true });
        log('warn', '[POLL] A poll response was not added!');
    }
}

//Update Response
async function updateResponse(fishsticks, pollObj, interaction) {
    //Determine former CID
    let CID = null;
    for (const res in pollObj.responses.types) {
        for (const id in pollObj.responses.types[res].ids) {
            if (pollObj.responses.types[res].ids[id] === interaction.member.id) {
                CID = pollObj.responses.types[res].cid;
            }
        }
    }

    if (!CID) {
        return interaction.reply({ content: 'No former response was found.', ephemeral: true });
    }

    //Remove ID from CID
    const rRes = await fishsticks.FSO_CONNECTION.db('FishsticksOnline').collection('FSO_Polls').updateOne({
        id: interaction.message.id,
        'responses.types.cid': CID
    }, {
        $pull: {
            'responses.types.$.ids': interaction.member.id
        }
    });

    //Add to new response
    const cRes = await fishsticks.FSO_CONNECTION.db('FishsticksOnline').collection('FSO_Polls').updateOne({
        id: interaction.message.id,
        'responses.types.cid': interaction.component.customId
    }, {
        $push: {
            'responses.types.$.ids': interaction.member.id
        }
    });

    if (cRes.modifiedCount === 1 && rRes.modifiedCount === 1) {
        interaction.reply({ content: 'Response updated.', ephemeral: true });
    }
    else {
        interaction.reply({ content: 'Response update failed!', ephemeral: true });
        console.log(cRes);
        console.log(rRes);
    }
}

//End Poll
async function endPoll(fishsticks, pollObj, interaction) {
    if (pollObj.responses.recVotes === 0) {
        return interaction.reply('No responses were submitted!')
            .then(sent => { setTimeout(() => sent.delete(), 10000); });
    }

    if(interaction.member.id !== pollObj.authId) {
        return interaction.reply('Only the poll owner can end the poll')
            .then(sent => { setTimeout(() => sent.delete(), 10000); });
    }

    const res = getWinner(fishsticks, pollObj);

    if (res.tieExists && pollObj.tied === true) {
        log('info', '[POLL] Tied found, confirmed >> ending poll.');
        await handleTie(fishsticks, pollObj, interaction, res);
    }
    else if (res.tieExists && pollObj.tied === false) {
        log('info', '[POLL] Tied found, not confirmed.');
        await verifyTie(fishsticks, interaction, res);
    }
    else {
        await handleWinner(fishsticks, pollObj, interaction, res);
    }
}

//Duplication check
function dupeCheck(pollData, intResId) {
    for (const i in pollData.responses.types) {
        //Iterate through response types
        for (const t in pollData.responses.types[i].ids) {
            //Iterate through listed IDs
            if (pollData.responses.types[i].ids[t] === intResId) {
                log('info', '[POLL] Duplicate detected, update response.');
                return true;
            }
        }
    }

    log('info', '[POLL] New response detected, record new response.');
    return false;
}

//Determine winning response
function getWinner(fishsticks, pollObj) {
    const results = {
        ties: [],
        winningVotes: 0,
        currWinner: null,
        tieExists: false
    };

    //Go through first to determine highest vote
    for (const ans in pollObj.responses.types) {
        if (pollObj.responses.types[ans].ids.length > results.winningVotes) {
            results.winningVotes = pollObj.responses.types[ans].ids.length;
            results.currWinner = pollObj.responses.types[ans].d;
        }
    }

    //Go through second time to find matching votes
    for (const ans in pollObj.responses.types) {
        if (pollObj.responses.types[ans].ids.length === results.winningVotes && pollObj.responses.types[ans].d !== results.currWinner) {
            results.ties.push(pollObj.responses.types[ans].d);
            results.tieExists = true;
        }
    }

    console.log(results);

    return results;
}

//Present Winner
async function handleWinner(fishsticks, pollObj, interaction, results) {
    console.log('Poll has clear winner.');
    //Update message with winner
    const updatedRow = new Discord.MessageActionRow();

    for (const res in pollObj.responses.types) {
        if (pollObj.responses.types[res].d === results.currWinner) {
            //Add winner button
            updatedRow.addComponents(
                new MessageButton()
                    .setCustomId(`POLL-${res}`)
                    .setStyle('SUCCESS')
                    .setLabel(pollObj.responses.types[res].d)
                    .setEmoji('✨')
            );
        }
        else {
            updatedRow.addComponents(
                new MessageButton()
                    .setCustomId(`POLL-${res}`)
                    .setStyle('PRIMARY')
                    .setLabel(pollObj.responses.types[res].d)
            );
        }
    }

    const endPollRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'update', { $set: { active: false } }, { id: interaction.message.id });

    //Re-post with button responses for winner
    interaction.message.edit({ content: 'Poll concluded!', components: [updatedRow] });
    interaction.reply({ content: 'Poll ended! The winning response was **__' + results.currWinner + '__**.' });
}

//Confirm whether to move on with tie or not
async function verifyTie(fishsticks, interaction, results) {
    let confirmMsg = `There's currently a tie in the poll responses between ${results.currWinner}`;

    for (const i in results.ties) {
        confirmMsg += ` and ${results.ties[i]}`;
    }

    confirmMsg += '. Are you sure you want to end the poll or wait for a break? Click End Poll again to confirm.';

    await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'update', { $set: { tied: true } }, { id: interaction.message.id });

    interaction.reply({ content: confirmMsg, ephemeral: true });
}

//Present Tie
async function handleTie(fishsticks, pollObj, interaction, result) {
    console.log('Poll tied.');

    const updatedRow = new MessageActionRow();

    //Iterate through responses
    for (const i in pollObj.responses.types) {
        for (const y in result.ties) {
            //Determine if tied winner response
            if (pollObj.responses.types[i].d === result.ties[y] || pollObj.responses.types[i].d === result.currWinner) {
                //Is a tied response
                updatedRow.addComponents(
                    new MessageButton()
                        .setCustomId(`POLL-${i}`)
                        .setStyle('SUCCESS')
                        .setLabel(pollObj.responses.types[i].d)
                        .setEmoji('✨')
                );
            }
            else {
                //Not a tied response
                updatedRow.addComponents(
                    new MessageButton()
                        .setCustomId(`POLL-${i}`)
                        .setStyle('PRIMARY')
                        .setLabel(pollObj.responses.types[i].d)
                );
            }
        }
    }

    const res = getWinner(fishsticks, pollObj);

    await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Polls', 'update', { $set: { active: false } }, { id: interaction.message.id });

    //Re-post with button responses for winner
    let tiePost = `Poll ended! The winning responses were **__${res.currWinner}__**`;

    for (const i in res.ties) {
        tiePost += ` and **__${res.ties[i]}__**`;
    }

    tiePost += '.';

    interaction.message.edit({ content: 'Poll concluded!', components: [updatedRow] });
    interaction.reply({ content: tiePost });
}