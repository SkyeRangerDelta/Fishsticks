// ---- Userinfo ----

//Imports
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { systemTimestamp } = require('../../Modules/Utility/Utils_Time');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { log } = require('../../Modules/Utility/Utils_Log');

//Export
module.exports = {
    run,
    help
};

async function run(fishsticks, cmd) {
    cmd.msg.delete();

    if (!hasPerms(cmd.msg.member, ['Moderator', 'Council Member'])) {
        return cmd.reply('You lack the permissions to do this!');
    }

    let username = null;

    if(!cmd.content[0]) {
        username = cmd.msg.member.displayName;
    }
    else {
        username = cmd.msg.content.split('-')[1];
        username = username.trim();
    }


    //Syntax: !userinfo [userName]
    let targetUser, targetMember;
    if (!cmd.msg.mentions.members.first()) {
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
        targetMember = await cmd.msg.mentions.members.first();
    }

    if (!targetMember) {
        log('warn', '[USER-INFO] Couldnt id a user.');
        return cmd.reply('Couldnt identify a user!', 10);
    }
    else {
        targetUser = targetMember.user;
        console.log(targetMember);
    }

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
        footer: `Report summoned by ${cmd.msg.member.displayName}`,
        thumbnail: targetMember.displayAvatarURL(),
        fields: [
            {
                name: 'ID',
                value: targetMember.id,
                inline: true
            },
            {
                name: 'Username',
                value: targetMember.user.username,
                inline: true
            },
            {
                name: 'Nickname',
                value: targetMember.nickname,
                inline: true
            },
            {
                name: 'Join Date',
                value: systemTimestamp(targetMember.joinedAt),
                inline: true
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
                value: targetUser.tag,
                inline: true
            }
        ]
    };

    cmd.channel.send({ content: 'Doing some snooping...', embeds: [embedBuilder(embed)] });
}

function help() {
    return '[Mod+] Displays some user details.';
}