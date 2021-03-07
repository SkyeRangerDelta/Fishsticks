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
    await cmd.msg.delete({ timeout: 0 });

    //Permissions check
    if (!hasPerms(['Moderator', 'Council Member', 'Council Advisor'])) {
        return cmd.msg.reply('Your lack of permissions disturbs me.').then(sent => sent.delete({ timeout: 10000 }));
    }

    //Syntax: !purge <@user> <number>

    const targetChannel = cmd.msg.channel;
    let count = 0;

    if (!cmd.msg.mentions.users.first()) {
        log('info', '[PURGE] No user detected, initiating general deletion.');

        count = parseInt(cmd[0]);
        if (!count || isNaN(count)) return cmd.msg.reply('No number specified, might as well just delete the whole channel if you want them all gone.').then(sent => sent.delete({ timeout: 10000 }));

        const targetChannelMsgs = await targetChannel.messages.fetch({ limit: count });

        if (count > 5) {
            cmd.msg.reply('Sit tight, this might take a minute.').then(sent => sent.delete({ timeout: 7000 }));
        }

        for (const msgObj in targetChannelMsgs) {
            await targetChannel.messages.fetch(targetChannelMsgs[msgObj]).then(msgColl => {
                msgColl.delete({ timeout: 0 });
            });
        }
    }
    else {
        log('info', '[PURGE] Possible user specified, initiating targeted deletion.');

        const targetMember = await cmd.msg.mentions.members.first();
        if (!targetMember) return cmd.msg.reply('No valid member found!').then(sent => sent.delete({ timeout: 10000 }));
        if (hasPerms(targetMember, ['Moderator', 'Event Coordinator', 'Council Advisor', 'Council Member'])) return cmd.msg.reply('Invalid member target!').then(sent => sent.delete({ timeout: 10000 }));

        count = parseInt(cmd[1]);
        if (!count || isNaN(count)) {
            log('warn', '[PURGE] No count specified, deleting all messages?');

            const targetChannelMsgs = await targetChannel.messages.fetch().then(m => m.filter(a => a.author.id === targetMember.id));

            for (const msgObj in targetChannelMsgs) {
                await targetChannel.messages.fetch(targetChannelMsgs[msgObj]).then(msgColl => {
                    msgColl.delete({ timeout: 0 });
                });
            }
        }
        else {
            if (count > 5) {
                cmd.msg.reply('Sit tight, this might take a minute.').then(sent => sent.delete({ timeout: 7000 }));
            }

            const targetChannelMsgs = await targetChannel.messages.fetch({ limit: count }).then(m => m.filter(a => a.author.id === targetMember.id));

            for (const msgObj in targetChannelMsgs) {
                await targetChannel.messages.fetch(targetChannelMsgs[msgObj]).then(msgColl => {
                    msgColl.delete({ timeout: 0 });
                });
            }
        }
    }
}

function help() {
    return 'Administrative command allowing bulk message deletion.';
}