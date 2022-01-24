// ---- Message Handler ----
//===========================
//Handles message events

//Imports
const { log } = require('../Utility/Utils_Log');
const { fso_validate, hasPerms } = require('../Utility/Utils_User');
const { fso_query } = require('../FSO/FSO_Utils');
const { generateErrorMsg, validateURL, handleDenMsg } = require('../Utility/Utils_Aux');
const { processXP } = require('../XP/XP_Core');
const { handleShiny } = require('../Utility/Utils_Shiny');
const { worst } = require('../../Commands/Passive/the');

const { prefix } = require('../Core/Core_config.json');
const { discDen } = require('../Core/Core_ids.json');

const extractUrls = require('extract-urls');

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
        await handleDenMsg(msg, Fishsticks);
    }

    //Determine 'Shiny'
    //Discord API does not let message to be rendered in any other way
    //TODO: Canvas?

    // --- Message Core ---

    //Do XP
    await processXP(Fishsticks, cmd);

    //Do Random Quote
    await processQuote(Fishsticks, cmd);

    //Handle Active Commands
    if (msg.content.startsWith(prefix)) {
        //const channel = msg.channel;

        //Active Command
        /*
        log('info', '[ACTIVE-CMD] Incoming active command: ' + cmd.ID);

        try {
            const cmdFile = require(`../../Commands/Active/${cmd.ID}`);
            await cmdFile.run(Fishsticks, cmd);

            //Success here
            log('info', '[ACTIVE-CMD] Executed successfully.');
            await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', {
                $inc: {
                    acAttempts: 1,
                    acSuccess: 1
                }
            }, { id: msg.author.id });
            await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', {
                $inc: {
                    cmdQueriesSucc: 1
                }
            }, { id: 1 });
        }
        catch (activeCmdErr) {
            //Fail here
            const upVal = {
                $inc: {
                    acAttempts: 1
                }
            };

            log('warn', '[ACTIVE-CMD] Execution failed.\n' + activeCmdErr);
            await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', upVal, { id: msg.author.id });
            await fso_query(Fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', {
                $inc: {
                    cmdQueriesFail: 1
                }
            }, { id: 1 });

            //Handle common error responses
            try {
                if (activeCmdErr.message.includes('../../Commands/Active/')) {
                    channel.send({ content: generateErrorMsg() + '\nI dont know the command: `' + cmd.ID + '` (did you miss a hyphen parameter?)' });
                }
                else if (activeCmdErr.message.includes('../../Modules')) {
                    channel.send({ content: generateErrorMsg() + `\nLooks like Im missing some major config somewhere and Im on the edge of losing it.\nPing ${Fishsticks.RANGER}` });
                }
                else if (activeCmdErr.message.includes('Test mode')) {
                    channel.send({ content: generateErrorMsg() + `\nThis is a test mode only command. It won't run unless ${Fishsticks.RANGER} is up to no good.` });
                }
                else if (activeCmdErr.message.includes('No permissions')) {
                    channel.send({ content: generateErrorMsg() + '\nLooks like you lack to necessary permissions to run this one.' });
                }
                else if (Fishsticks.TESTMODE) {
                    channel.send({ content: '**Test Mode Log**:\n' + generateErrorMsg() + '\n' + activeCmdErr.message + '\n' + activeCmdErr.stack });
                }
                else {
                    channel.send({ content: generateErrorMsg() + '\n' + activeCmdErr.message });
                }
            }
            catch (cErr) {
                channel.send(generateErrorMsg() + '\nNot quite sure what to make of that. Looks like a crash. ' + Fishsticks.RANGER + ' please investigate.');
            }
        }
         */
    }
    else {
        //Passive Command Handler

        const passiveID = msg.content.trim().toLowerCase().split(' ')[0];
        try {
            const passiveCmd = require(`../../Commands/Passive/${passiveID}.js`);
            passiveCmd.run(Fishsticks, cmd);
        }
        catch (passiveCmdErr) {
            log('info', '[PASSIVE-CMD] Attempt failed.');
        }
        finally {
            //Attempt possible unique messages

            /*
            //TODO: Re-enable later
            //URL Scan Framework
            if (cmd.msg.content.includes('http://') || cmd.msg.content.includes('https://')) {
                log('info', 'URL scanner triggered.');
                //Link included in message; check poster perms
                if (!hasPerms(cmd.msg.member, ['Moderator', 'Event Coordinator', 'Council Advisor', 'Council Member'])) {
                    //Not a staff member, check link
                    const urls = extractUrls(cmd.msg.content);
                    await validateURL(cmd.msg, urls);
                }
            }
             */

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
async function generateRandomQuote(fishsticks, cmd) {
    const quotes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_QuoteRef', 'selectAll');

    const quoteIndex = Math.floor(Math.random() * quotes.length);
    log('proc', `[R-QUOTE] New quote fired. Index ${quoteIndex}.`);

    //Send it
    cmd.channel.send(`${quotes[quoteIndex].q}`);
}

//Generate a new tick count
function newTick() {
    return Math.round(Math.random() * (1000 - 25) + 25);
}