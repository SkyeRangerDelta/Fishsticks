//----PURGE----
//-------------
//Clears a users posts

//Imports
const { log } = require('../../Modules/Utility/Utils_Log');
const { hasPerms } = require('../../Modules/Utility/Utils_User');

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {
    await cmd.msg.delete();

    //Permissions check
    if (!hasPerms(cmd.msg.member, ['Moderator', 'Council Member', 'Council Advisor'])) {
        return cmd.reply('Your lack of permissions disturbs me.', 10);
    }

    //Syntax: !purge <@user> <number>

    const targetChannel = cmd.msg.channel;
    let count = 0;

    if (!cmd.msg.mentions.users.first()) {
        log('info', '[PURGE] No user detected, initiating general deletion.');

        count = parseInt(cmd.content[0]);

        if (!count || isNaN(count)) {
            return cmd.reply('No number specified, might as well just delete the whole channel if you want them all gone.', 10);
        }

        if (count > 5) {
            cmd.reply(`Sit tight, this might take a minute. (Processing ${count} messages.)`, 7);
        }

        const targetChannelMsgs = await targetChannel.messages.fetch({ limit: count });

        targetChannelMsgs.forEach(msgItem => {
            msgItem.delete();
        });
    }
    else {
        log('info', '[PURGE] Possible user specified, initiating targeted deletion.');

        const targetMember = await cmd.msg.mentions.members.first();
        if (!targetMember) {
            return cmd.reply('No valid member found!', 10);
        }
        if (hasPerms(targetMember, ['Moderator', 'Event Coordinator', 'Council Advisor', 'Council Member'])) {
            return cmd.reply('Invalid member target!', 10);
        }

        count = parseInt(cmd.content[1]);
        if (!count || isNaN(count)) {
            log('warn', '[PURGE] No count specified, deleting all messages?');

            const targetChannelMsgs = await targetChannel.messages.fetch().then(m => m.filter(a => a.author.id === targetMember.id));

            for (const msgObj in targetChannelMsgs) {
                await targetChannel.messages.fetch(targetChannelMsgs[msgObj]).then(msgColl => {
                    msgColl.delete();
                });
            }
        }
        else {
            if (count > 5) {
                cmd.reply('Sit tight, this might take a minute.', 7);
            }

            const targetChannelMsgs = await targetChannel.messages.fetch({ limit: count }).then(m => m.filter(a => a.author.id === targetMember.id));

            for (const msgObj in targetChannelMsgs) {
                await targetChannel.messages.fetch(targetChannelMsgs[msgObj]).then(msgColl => {
                    msgColl.delete();
                });
            }
        }
    }
}

function help() {
    return 'Administrative command allowing bulk message deletion.';
}