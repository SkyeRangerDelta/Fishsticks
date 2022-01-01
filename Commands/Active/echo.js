// ---- Echo ----
//Posts an ping on a delayed timer in Announcements

const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { announcements } = require('../../Modules/Core/Core_ids.json');
const { log } = require('../../Modules/Utility/Utils_Log');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');
const { findRole } = require('./role');

let annChannel;

//Exports
module.exports = {
    run,
    help
};

async function run(fishsticks, cmd) {
    cmd.msg.delete();

    annChannel = await fishsticks.channels.cache.get(announcements);

    if (!hasPerms(cmd.msg.member, ['Event Coordinator', 'Moderator', 'Council Member', 'Council Advisor'])) {
        return cmd.reply('Hey, hey there; not so fast. You need permissions to run that command.', 15);
    }

    //Syntax: !echo <waitTimeInMinutes> [pingType] [messageToSend]
    //!echo -10 -Blah                       sends blah in 10 minutes to everyone
    //!echo -10 -wzfiretime -blah           sends blah in 10 minutes to wzfireteam
    //!echo -wzfireteam -blah               sends blah to wzfireteam instantly

    //Accepted ping types: e, everyone, h, here, game role, game name

    if (!cmd.content[0]) {
        cmd.reply('Why do I waste my time here. You cant dispatch an announcement with nothing in the message.', 10);
    }

    let waitTime;
    try {
        waitTime = (parseInt(cmd.content[0]) * 60) * 1000;
    }
    catch (e) {
        waitTime = -1;
    }

    if (waitTime === -1 || isNaN(waitTime)) {
        log('info', '[ECHO] Announcement has no wait time, immediate post.');
        //First param is not a number, check ping type or message

        const disMsg = toTitleCase(cmd.content[1]);

        switch (cmd.content[0]) {
            case 'e':
            case 'everyone':
                setTimeout(dispatchMsg, 0, '@everyone ' + disMsg);
                break;
            case 'h':
            case 'here':
                setTimeout(dispatchMsg, 0, '@here ' + disMsg);
                break;
            case 'n':
            case 's':
            case 'soft':
            case 'none':
                setTimeout(dispatchMsg, 0, disMsg);
                break;
            default:
                await doPingDispatch(fishsticks, cmd);
        }
    }
    else {
        log('info', `[ECHO] Announcement has ${waitTime} minute wait time.`);

        cmd.reply(`Roger that, waiting ${cmd.content[0]} minute(s) to post.`, 10);

        const disMsg = toTitleCase(cmd.content[2]);

        switch (cmd.content[1]) {
            case 'e':
            case 'everyone':
                setTimeout(dispatchMsg, waitTime, '@everyone ' + disMsg);
                break;
            case 'h':
            case 'here':
                setTimeout(dispatchMsg, waitTime, '@here ' + disMsg);
                break;
            case 'n':
            case 's':
            case 'soft':
            case 'none':
                setTimeout(dispatchMsg, waitTime, disMsg);
                break;
            default:
                await doPingDispatch(fishsticks, cmd, waitTime);
        }
    }
}

function help() {
    return 'Posts a delayed announcement.';
}

function dispatchMsg(msg) {
    annChannel.send({ content: msg });
}

async function getRolePing(fishsticks, cmd, role) {
    let rolePing;

    if (!cmd.msg.mentions.roles.first()) {
        //No ping - returns DiscordID
        const roleObj = await findRole(fishsticks, role);
        rolePing = roleObj.discordID;
    }
    else {
        //Returns role OBJ
        const rolePingObj = cmd.msg.mentions.roles.first();
        rolePing = rolePingObj.id;
    }

    if (!rolePing) {
        return '@everyone';
    }
    else {
        const roleToPing = fishsticks.CCG.roles.cache.get(rolePing);
        return `${roleToPing} `;
    }
}

async function doPingDispatch(fs, cmd, wait) {

    if (!wait) {
        const disMsg = await toTitleCase(cmd.content[1]);
        const sendMsg = await getRolePing(fs, cmd, cmd.content[0]) + disMsg;
        setTimeout(dispatchMsg, 0, sendMsg);
    }
    else {
        const disMsg = await toTitleCase(cmd.content[2]);
        const sendMsg = await getRolePing(fs, cmd, cmd.content[1]) + disMsg;
        setTimeout(dispatchMsg, wait, sendMsg);
    }
}