// ---- Echo ----
//Posts an ping on a delayed timer in Announcements

const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { announcements } = require('../../Modules/Core/Core_ids.json');
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

    if (!hasPerms(cmd.msg.member, ['Event Coordinator', 'Staff'])) {
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

    if ((typeof cmd.content[0] != typeof 0) || isNaN(cmd.content[0])) {
        //First param is not a number, check ping type or message

        switch (cmd.content[0]) {
            case 'e':
            case 'everyone':
                setTimeout(dispatchMsg, 0, '@everyone ' + cmd.content[1]);
                break;
            case 'h':
            case 'here':
                setTimeout(dispatchMsg, 0, '@here ' + cmd.content[1]);
                break;
            case 'n':
            case 'none':
                setTimeout(dispatchMsg, 0, cmd.content[1]);
                break;
            default:
                setTimeout(dispatchMsg, 0, getRolePing + cmd.content[1]);
        }
    }
    else {
        const waitTime = (cmd.content[0] * 60) * 1000;

        switch (cmd.content[1]) {
            case 'e':
            case 'everyone':
                setTimeout(dispatchMsg, waitTime, '@everyone ' + cmd.content[2]);
                break;
            case 'h':
            case 'here':
                setTimeout(dispatchMsg, waitTime, '@here ' + cmd.content[2]);
                break;
            case 'n':
            case 'none':
                setTimeout(dispatchMsg, waitTime, cmd.content[2]);
                break;
            default:
                setTimeout(dispatchMsg, waitTime, getRolePing + cmd.content[2]);
        }
    }
}

function help() {
    return 'Posts a delayed announcement.';
}

function dispatchMsg(msg) {
    annChannel.send({ content: msg });
}

async function getRolePing(fishsticks, query) {
    const rolePingID = findRole(fishsticks, query);

    if (rolePingID === -1) {
        return '@everyone';
    }
    else {
        const rolePing = fishsticks.CCG.roles.cache.get(rolePingID);
        return `${rolePing.name}`;
    }
}