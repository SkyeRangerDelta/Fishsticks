// ---- Message Handler ----
//===========================
//Handles message events

//Imports
const { log } = require('../Utility/Utils_Log');
const { fso_validate, hasPerms } = require('../Utility/Utils_User');
const { fso_query } = require('../FSO/FSO_Utils');
const { handleDenMsg } = require('../Utility/Utils_Aux');
const { processXP } = require('../XP/XP_Core');
const { handleShiny } = require('../Utility/Utils_Shiny');

const { prefix } = require('../Core/Core_config.json');
const { discDen, prReqs } = require('../Core/Core_ids.json');

//Exports
module.exports = {
    processMessage,
    generateRandomQuote
};

//Functions
async function processMessage(Fishsticks, msg) {

    // --- Pre Message Core ---

    //Member validation
    await fso_validate(Fishsticks, msg);

    //Handler
    const cmdBreakup = msg.content.toLowerCase().substring(1, msg.content.length).split('-');
    const cmd = {
        ID: cmdBreakup.shift().trim(),
        content: [],
        msg: msg,
        channel: msg.channel,
        reply: function(resp, delTime) {
            msg.channel.send(`${msg.member}, ${resp}`)
                .then(s => {
                    if (delTime) {
                        setTimeout(() => s.delete(), delTime * 1000);
                    }
                });
        }
    };

    //Trim content
    for (const param in cmdBreakup) {
        cmd.content.push(cmdBreakup[param].trim());
    }

    // --- Aux Functions ---

    //Check BaconMode
    if (msg.author.id === Fishsticks.baconTarget) {
        await msg.react('🥓');
    }

    //Check Debater
    if (msg.channel.id === discDen) {
        await handleDenMsg(cmd, Fishsticks);
    }

    //Determine 'Shiny'
    //Discord API does not let message to be rendered in any other way
    //TODO: Canvas?

    // --- Message Core ---

    //Do XP
    await processXP(Fishsticks, cmd);

    //Do Random Quote
    await processQuote(Fishsticks, cmd);

    //Message handling
    if (!msg.content.startsWith(prefix)) {
        //Passive Command Handler

        const passiveID = msg.content.trim().toLowerCase().split(' ')[0];
        try {
            const passiveCmd = require(`../../Commands/Passive/${passiveID}.js`);

            if (cmd.channel.id === prReqs) return;

            passiveCmd.run(Fishsticks, cmd);
        }
        catch (passiveCmdErr) {
            log('info', '[PASSIVE-CMD] Attempt failed.');
        }
        finally {
            //Attempt possible unique messages
            if (cmd.msg.content.includes('https://twitch.tv/')) {
                if (!hasPerms(cmd.msg.member, ['The Nod']) && !hasPerms(cmd.msg.member, ['Moderator', 'Council Member', 'Council Advisor'])) {
                    cmd.reply('You need the nod to post Twitch links!');
                }
            }

            //Shiny?
            const number = Math.random() * (8192 - 1) + 1;
            if (number === 5 && msg.content.length <= 70) {
                await handleShiny(msg);
            }

            //Karen Mode
            const pMsg = cmd.msg.content.toLowerCase();
            if ((pMsg.includes('speak to your manager')) && (pMsg.includes('fishsticks'))) {
                cmd.channel.send({ content: `${Fishsticks.RANGER}, some nark wants to talk to you.` });
            }
        }
    }
}

//Process the random quote logic
async function processQuote(fishsticks, cmd) {
    const quoteCheck = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Status', 'select', { id: 1 });
    const tick = quoteCheck.rMsgTick;

    if (!quoteCheck) throw 'Didnt receive an FSO response!';

    if (tick === 0 || !tick || isNaN(tick)) {
        log('info', '[R-QUOTE] Tick was on DB check, resetting...');
        const newTickNum = newTick();

        return await updateQuoteTick(fishsticks, newTickNum);
    }

    if ((tick - 1) === 0) {
        const newTickNum = newTick();
        await generateRandomQuote(fishsticks, cmd);

        await updateQuoteTick(fishsticks, newTickNum);
    }
    else {
        await updateQuoteTick(fishsticks, (tick - 1));
    }
}

//Update status
async function updateQuoteTick(fishsticks, tickNum) {
    const rMsgStatus = {
        $set: {
            rMsgTick: tickNum
        }
    };

    const updateRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', rMsgStatus, { id: 1 });

    //Validate
    if (updateRes.modifiedCount !== 1) {
        log('warn', '[R-QUOTE] Tick update failed.');
    }
    else {
        log('proc', '[R-QUOTE] Tick update done.');
    }
}

//Generate the random quote and return
async function generateRandomQuote(fishsticks, int) {
    const quotes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'selectAll');

    const quoteIndex = Math.floor(Math.random() * quotes.length);
    log('proc', `[R-QUOTE] New quote fired. Index ${quoteIndex}.`);

    //Send it
    int.channel.send(`${quotes[quoteIndex].q}`);
}

//Generate a new tick count
function newTick() {
    return Math.round(Math.random() * (1000 - 25) + 25);
}