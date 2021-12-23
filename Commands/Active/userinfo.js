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

    //Get name as formatted by command issuer
    const username = cmd.msg.content.split('-')[1].trim();

    //Syntax: !userinfo [userName]
    let userToDetail = null;
    if (!cmd.msg.mentions.members.first()) {
        log('info', `[USER-INFO] Pulling report from text input (${username}).`);
        userToDetail = await fishsticks.CCG.members.cache.find(u => u.displayName === username);
    }
    else {
        log('info', '[USER-INFO] Pulling report from mention.');
        userToDetail = await cmd.msg.mentions.members.first();
    }

    if (!userToDetail) {
        log('warn', '[USER-INFO] Couldnt id a user.');
        return cmd.reply('Couldnt identify a user!');
    }

    const vc = await userToDetail.voice.channel;
    let vs;

    if (!vc) {
        vs = 'Not connected.';
    }
    else {
        vs = `Connected to ${vc.name}`;
    }

    const embed = {
        title: `[Intelligence Profile] ${userToDetail.displayName}`,
        description: 'Heres that report you asked for...',
        footer: `Report summoned by ${cmd.msg.member.displayName}`,
        thumbnail: userToDetail.displayAvatarURL(),
        fields: [
            {
                name: 'ID',
                value: userToDetail.id,
                inline: true
            },
            {
                name: 'Join Date',
                value: systemTimestamp(userToDetail.joinedAt),
                inline: true
            },
            {
                name: 'Membership Gate Status',
                value: `${ userToDetail.pending }`,
                inline: true
            },
            {
                name: 'Voice State',
                value: vs,
                inline: true
            },
            {
                name: 'Bot?',
                value: `${ userToDetail.user.bot }`,
                inline: true
            },
            {
                name: 'Tag',
                value: userToDetail.user.tag,
                inline: true
            }
        ]
    };

    cmd.channel.send({ content: 'Doing some snooping...', embeds: [embedBuilder(embed)] });
}

function help() {
    return '[Mod+] Displays some user details.';
}