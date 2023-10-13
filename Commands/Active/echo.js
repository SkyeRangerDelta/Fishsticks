// ---- Echo ----
//Posts an ping on a delayed timer in Announcements

const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { announcements } = require('../../Modules/Core/Core_ids.json');
const { findRole } = require('./role');
const { SlashCommandBuilder } = require('@discordjs/builders');

let annChannel;

//Globals
const data = new SlashCommandBuilder()
    .setName('echo')
    .setDescription('Posts a delayed announcement');

data.addNumberOption(o => o
    .setName('wait-time')
    .setDescription('The time to wait in minutes before posting the announcement.')
    .setRequired(true));

data.addStringOption(o => o
    .setName('announcement')
    .setDescription('The announcement to post.')
    .setRequired(true));

data.addRoleOption(o => o
    .setName('role-ping')
    .setDescription('What game role should be pinged? (ONLY WORKS FOR GAME ROLES)'));

data.addStringOption(o => o
    .setName('ping-type')
    .setDescription('If pinging a role, name that role by name or game (as seen in !roles), pick a choice otherwise.')
    .addChoices(
        {
            name: 'everyone',
            value: 'everyone'
        },
        {
            name: 'here',
            value: 'here'
        },
        {
            name: 'soft',
            value: 'soft'
        }
    )
);

//Functions
async function run(fishsticks, int) {
    annChannel = await fishsticks.channels.cache.get(announcements);

    if (!hasPerms(int.member, ['Event Coordinator', 'Moderator', 'Council Member', 'Council Advisor'])) {
        return int.reply({ content: 'Hey, hey there; not so fast. You need permissions to run that command.', ephemeral: true });
    }

    //Syntax: echo wait-time role-ping(?) ping-type(?) announcement

    if (!int.options.getString('announcement')) {
        return int.reply({ content: 'Why do I waste my time here. You cant dispatch an announcement with nothing in the message.', ephemeral: true });
    }

    let waitTime = int.options.getNumber('wait-time');
    if (waitTime <= 0) {
        return int.reply({ content: 'Thought you could pull a fast one huh? Right, if you dont want a delay, post it yourself.', ephemeral: true });
    }
    else {
        waitTime = waitTime * 60 * 1000;
    }

    if (!int.options.getRole('role-ping') && !int.options.getString('ping-type')) {
        return int.reply({ content: 'My goodness, you are quite the obnoxious one arent you? You need to specify a ping type or role ping!', ephemeral: true });
    }
    else if (!int.options.getString('ping-type')) {
        //Check role
        const role = int.options.getRole('role-ping');
        const roleObj = await findRole(fishsticks, role.name);

        if (!roleObj || roleObj === -1) {
            return int.reply({ content: 'Did you ping a valid game role?', ephemeral: true });
        }
        else {
            int.reply({ content: 'Timeout set, waiting ' + int.options.getNumber('wait-time') + ' minutes before deploying.', ephemeral: true });
            setTimeout(dispatchMsg, waitTime, role + ', ' + int.options.getString('announcement'));
        }
    }
    else if (!int.options.getRole('role-ping')) {
        //Check ping type (ensure a choice selection)
        const pingType = int.options.getString('ping-type');
        if (pingType === 'here' || pingType === 'everyone') {
            int.reply({ content: 'Timeout set, waiting ' + int.options.getNumber('wait-time') + ' minutes before deploying.', ephemeral: true });
            setTimeout(dispatchMsg, waitTime, `@${pingType}, ` + int.options.getString('announcement'));
        }
        else if (pingType === 'soft') {
            int.reply({ content: 'Timeout set, waiting ' + int.options.getNumber('wait-time') + ' minutes before deploying.', ephemeral: true });
            setTimeout(dispatchMsg, waitTime, int.options.getString('announcement'));
        }
        else {
            return int.reply({ content: 'Invalid ping type! Im not out here to make random announcements.', ephemeral: true });
        }
    }
    else {
        return int.reply({ content: 'Looks like you found a way to befuddle me. Still wont make the announcement though - recheck your ping types.', ephemeral: true });
    }
}

function help() {
    return 'Posts a delayed announcement.';
}

function dispatchMsg(msg) {
    annChannel.send({ content: msg });
}

//Exports
module.exports = {
    name: 'echo',
    data,
    run,
    help
};