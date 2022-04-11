// ---- Userinfo ----

//Imports
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { timeSinceDate } = require('../../Modules/Utility/Utils_Time');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { log } = require('../../Modules/Utility/Utils_Log');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays user details. [Mod+]');

data.addStringOption(o => o.setName('username').setDescription('The name of the user to find details for.'));
data.addUserOption(o => o.setName('user-mention').setDescription('The PING of the user to find details for.'));

async function run(fishsticks, int) {
    if (!hasPerms(int.member, ['Moderator', 'Council Member'])) {
        return int.reply('You lack the permissions to do this!');
    }

    const username = int.getString('username');
    const userping = int.getUser('user-mention');

    //Syntax: /userinfo userName? userMention?
    let targetMember;
    if (!username) {
        log('info', `[USER-INFO] Pulling report from text input (${username}).`);
        targetMember = await fishsticks.CCG.members.cache.find(u => u.user.username === `${username}`);

        if (!targetMember) {
            log('info', '[USER-INFO] Could not find a valid username');
            targetMember = await fishsticks.CCG.members.cache.find(u => u.displayName === `${username}`);

            if (!targetMember) {
                log('info', '[USER-INFO] Could not find a valid displayname');
                targetMember = await fishsticks.CCG.members.cache.find(u => u.user.tag === `${username}`);
            }
        }
    }
    else {
        log('info', '[USER-INFO] Pulling report from mention.');
        targetMember = userping;
    }

    if (!targetMember) {
        log('warn', '[USER-INFO] Couldnt id a user.');
        return int.reply({ content: 'Couldnt identify a user!', ephemeral: true });
    }

    const targetUser = targetMember.user;

    log('info', '[USER-INFO] Pulling FSO profile for ' + targetUser.tag);
    const memberProf = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: targetUser.id });

    const vState = await targetMember.voice;
    let vCh, vName;

    if (!vState) {
        vCh = null;
    }
    else {
        vCh = vState.channel;
    }

    if (!vCh) {
        vName = 'Not connected.';
    }
    else {
        vName = `Connected to ${vCh.name}`;
    }

    const embed = {
        title: `[Intelligence Profile] ${targetMember.displayName}`,
        description: 'Heres that report you asked for...',
        footer: `Report summoned by ${int.member.displayName}`,
        thumbnail: targetMember.displayAvatarURL(),
        fields: [
            {
                name: 'ID',
                value: `${targetMember.id}`,
                inline: false
            },
            {
                name: 'Username',
                value: `${targetMember.user.username}`,
                inline: true
            },
            {
                name: 'Nickname (if applicable)',
                value: `${targetMember.displayName}`,
                inline: true
            },
            {
                name: 'Join Date',
                value: `${memberProf.joinTimeFriendly} been a member for ${ timeSinceDate(memberProf.joinMs) }`,
                inline: false
            },
            {
                name: 'Membership Gate Status',
                value: `${ targetMember.pending }`,
                inline: true
            },
            {
                name: 'Voice State',
                value: `${vName}`,
                inline: true
            },
            {
                name: 'Bot?',
                value: `${ targetUser.bot }`,
                inline: true
            },
            {
                name: 'Tag',
                value: `${targetUser.tag}`,
                inline: true
            }
        ]
    };

    int.reply({ content: 'Doing some snooping...', embeds: [embedBuilder(embed)] });
}

function help() {
    return '[Mod+] Displays some user details.';
}

//Exports
module.exports = {
    name: 'userinfo',
    data,
    run,
    help
};