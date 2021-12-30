// ---- XP Functions ----
//=======================

//Imports
const { fso_query } = require('../FSO/FSO_Utils');
const { log } = require('../Utility/Utils_Log');
const { discDen, prReqs, bStudy } = require('../Core/Core_ids.json');

//Exports
module.exports = {
    processXP
};

//Functions
async function processXP(fishsticks, cmd) {
    log('info', '[XP-SYS] Processing message');

    //Get profile
    const memberProf = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: cmd.msg.member.id });

    //Update profile
    let update = null;

    if (!memberProf.lastMsg) {
        update = {
            $set: {
                messagesSent: memberProf.messagesSent + 1,
                lastMsg: cmd.msg.createdAt
            }
        };
    }
    else {
        update = {
            $set: {
                messagesSent: memberProf.messagesSent + 1,
            }
        };
    }
    await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', update, { id: cmd.msg.member.id });

    //Valid message for XP?
    const msgTimeDiff = cmd.msg.createdAt - memberProf.lastMsg;

    console.log(cmd.msg.createdAt);
    console.log(memberProf.lastMsg);
    console.log(msgTimeDiff);

    if (msgTimeDiff < 60000) {
        return log('info', '[XP-SYS] Message sent too soon since previous for XP.');
    }

    //Begin processing
    await doXP(fishsticks, cmd, memberProf);
}

//Begin working on XP
async function doXP(fishsticks, cmd, memberProf) {
    const msgScore = determineXPScore(cmd);
    const xpGen = determineXP(msgScore);

    let currLvl = memberProf.xp.level;
    let lvlTriggered = false;
    const currXP = memberProf.xp.RP;
    const xpForNxtLvl = Math.floor(66.1 * (Math.pow(currLvl + 1, 1.79)));

    console.log(currXP);
    console.log(xpForNxtLvl);

    if (currXP + xpGen >= xpForNxtLvl) {
        log('proc', '[XP-SYS] Level up! (+' + xpGen + ')');
        currLvl = currLvl + 1;
        lvlTriggered = true;
        //TODO: Canvas?
    }

    const updateProf = {
        $set: {
            xp: {
                level: currLvl,
                RP: currXP + xpGen,
                goldfish: currXP + xpGen,
                spentGoldfish: memberProf.spentGoldfish
            },
            lastMsg: cmd.msg.createdAt
        }
    };

    const updateProfRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', updateProf, { id: memberProf.id });

    if (updateProfRes.modifiedCount === 1) {
        if (lvlTriggered) {
            if (cmd.channel.id === discDen || cmd.channel.id === prReqs || cmd.channel.id === bStudy) {
                fishsticks.CONSOLE.send(`${cmd.msg.member}, You've reached level ${currLvl}!`, 10000);
            }
            else {
                cmd.reply(`You've reached level ${currLvl}!`, 10);
            }
        }
    }
    else {
        log('warn', '[XP-SYS] Error updating member XP profile!');
        cmd.channel.send(`${fishsticks.RANGER}, went wrong with the XP profile update, check the logs!`);
    }
}

//Determines whether or not the XP accrued from this post will be increased due to quality
function determineXPScore(cmd) {
    //Measure length
    const lengthScore = Math.floor(Math.pow(cmd.msg.content.length, 0.2));

    //Detect punctuation
    const puncScore = {
        general: 0,
        score: 0,
        period: 0,
        question: 0,
        exclamation: 0,
        sQuote: 0,
        dQuote: 0
    };

    for (let x = 0; x < cmd.msg.content.length; x++) {
        const i = cmd.msg.content.charAt(x);

        if (i === '.') {
            puncScore.general++;
            puncScore.period++;
        }
        else if (i === '?') {
            puncScore.general++;
            puncScore.question++;
        }
        else if (i === '!') {
            puncScore.general++;
            puncScore.exclamation++;
        }
        else if (i === `'`) {
            puncScore.general++;
            puncScore.sQuote++;
        }
        else if (i === '"') {
            puncScore.general++;
            puncScore.dQuote++;
        }
    }

    if (puncScore.general >= 1) {
        puncScore.score += 1;
        puncScore.score += Math.floor(Math.pow(puncScore.general, 0.5));
    }

    //Formatting?
    const charScore = {
        general: 0,
        score: 0,
        asterisk: 0,
        underscore: 0,
        accent: 0,
        grave: 0,
        angle: 0
    };

    for (let x = 0; x < cmd.msg.content.length; x++) {
        const i = cmd.msg.content.charAt(x);

        if (i === '*') {
            charScore.general++;
            charScore.asterisk++;
        }
        else if (i === '_') {
            charScore.general++;
            charScore.underscore++;
        }
        else if (i === '~') {
            charScore.general++;
            charScore.accent++;
        }
        else if (i === '`') {
            charScore.general++;
            charScore.grave++;
        }
        else if (i === '>') {
            charScore.general++;
            charScore.angle++;
        }
    }

    if (charScore.general >= 1) {
        charScore.score += 1;
    }

    if (charScore.general % 2 === 0) {
        charScore.score += Math.floor(Math.pow(charScore.general, 0.5));
    }

    //Links
    let linkScore = 0;
    if (cmd.msg.content.includes('http://') || cmd.msg.content.includes('https://')) {
        linkScore += 1;
    }

    //Attachments
    const attachScore = Math.ceil(cmd.msg.attachments.size / 2);

    //Emojis
    const reactScore = Math.ceil(cmd.msg.reactions.cache.size / 4);

    //Final calc
    return lengthScore + puncScore.score + charScore.score + linkScore + attachScore + reactScore;
}

//Generates the XP
function determineXP(msgScore) {
    if (msgScore < 5) {
        return Math.floor(Math.random() * (30 - 20) + 20);
    }
    else {
        return Math.floor(Math.random() * (40 - 30) + 20);
    }
}