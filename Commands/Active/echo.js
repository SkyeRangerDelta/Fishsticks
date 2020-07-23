// ---- Echo ----
//Posts an everyone ping on a delayed timer

const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { announcements } = require('../../Modules/Core/Core_ids.json');

let annChannel;

//Exports
module.exports = {
    run,
    help
};

function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    annChannel = fishsticks.channels.cache.get(announcements);

    if (!hasPerms(cmd.msg.author, ['Event Coordinator', 'Staff'])) {
        return cmd.msg.reply('Hey, hey there; not so fast. You need permissions to run that command.');
    }

    if ((typeof cmd[0] != typeof 0) || isNaN(cmd[0])) {
        setTimeout(dispatchMsg, 0, '@everyone ' + cmd[0]);
    }
    else {
        const waitTime = (cmd[0] * 60) * 1000;
        setTimeout(dispatchMsg, waitTime, '@everyone ' + cmd[1]);
    }
}

function help() {
    return 'Posts a delayed announcement.';
}

function dispatchMsg(msg) {
    annChannel.send(msg);
}