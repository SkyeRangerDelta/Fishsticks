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
    cmd.msg.delete({ timeout: 0 });

    annChannel = fishsticks.channels.cache.get(announcements);

    if (!hasPerms(cmd.msg.author, ['Event Coordinator', 'Staff'])) {
        return cmd.msg.reply('Hey, hey there; not so fast. You need permissions to run that command.');
    }

    //Syntax: !echo <waitTimeInMinutes> [pingType] [messageToSend]
    //!echo -10 -Blah                       sends blah in 10 minutes to everyone
    //!echo -10 -wzfiretime -blah           sends blah in 10 minutes to wzfireteam
    //!echo -wzfireteam -blah               sends blah to wzfireteam instantly

    //Accepted ping types: e, everyone, h, here, game role, game name

    if (!cmd[0] || cmd[0] == null || cmd[0] == undefined) {
        cmd.msg.reply('Why do I waste my time here. You cant dispatch an announcement with nothing in the message.').then(sent => sent.delete({ timeout: 10000 }));
    }

    if ((typeof cmd[0] != typeof 0) || isNaN(cmd[0])) {
        //First param is not a number, check ping type or message

        switch (cmd[0]) {
            case 'e':
            case 'everyone':
                setTimeout(dispatchMsg, 0, '@everyone ' + cmd[1]);
                break;
            case 'h':
            case 'here':
                setTimeout(dispatchMsg, 0, '@here ' + cmd[1]);
                break;
            default:
                setTimeout(dispatchMsg, 0, getRolePing + cmd[1]);
        }
    }
    else {
        const waitTime = (cmd[0] * 60) * 1000;

        switch (cmd[1]) {
            case 'e':
            case 'everyone':
                setTimeout(dispatchMsg, waitTime, '@everyone ' + cmd[2]);
                break;
            case 'h':
            case 'here':
                setTimeout(dispatchMsg, waitTime, '@here ' + cmd[2]);
                break;
            default:
                setTimeout(dispatchMsg, waitTime, getRolePing + cmd[2]);
        }
    }
}

function help() {
    return 'Posts a delayed announcement.';
}

function dispatchMsg(msg) {
    annChannel.send(msg);
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