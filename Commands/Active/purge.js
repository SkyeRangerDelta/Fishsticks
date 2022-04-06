//----PURGE----
//-------------
//Clears a users posts

//Imports
const { log } = require('../../Modules/Utility/Utils_Log');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('purge')
    .setDescription('[Mod+] Clears a number of posts from a channel or from a specific user in a channel.');

data.addIntegerOption(o => o.setName('post-count').setDescription('How many posts to delete.').setRequired(true));
data.addUserOption(o => o.setName('target-user').setDescription('The user whose posts to delete.'));

//Functions
async function run(fishsticks, int) {
    //Permissions check
    if (!hasPerms(int.member, ['Moderator', 'Council Member', 'Council Advisor'])) {
        return int.reply({ content: 'Your lack of permissions disturbs me.', ephemeral: true });
    }

    //Syntax: /purge post-count target-user?

    const targetChannel = int.channel;
    const count = int.options.getInteger('post-count');
    const targetMember = int.options.getUser('target-user');

    if (!targetMember) {
        log('info', '[PURGE] No user detected, initiating general deletion.');

        if (count === 0) {
            return int.reply({ content: 'No number specified, might as well just delete the whole channel if you want them all gone.', ephemeral: true });
        }

        if (count > 5) {
            int.reply({ content: `Sit tight, this might take a minute. (Processing ${count} messages.)`, ephemeral: true });
        }

        const targetChannelMsgs = await targetChannel.messages.fetch({ limit: count });

        targetChannelMsgs.forEach(msgItem => {
            msgItem.delete();
        });
    }
    else {
        log('info', '[PURGE] Possible user specified, initiating targeted deletion.');

        if (hasPerms(targetMember, ['Moderator', 'Event Coordinator', 'Council Advisor', 'Council Member'])) {
            return int.reply({ content: 'Invalid member target!', ephemeral: true });
        }

        if (count === 0) {
            log('warn', '[PURGE] No count specified, deleting all messages?');

            const targetChannelMsgs = await targetChannel.messages.fetch().then(m => m.filter(a => a.author.id === targetMember.id));
            int.reply({ content: 'Sit tight, this might take a *hot* minute.', ephemeral: true });

            for (const msgObj in targetChannelMsgs) {
                await targetChannel.messages.fetch(targetChannelMsgs[msgObj]).then(msgColl => {
                    msgColl.delete();
                });
            }
        }
        else {
            if (count > 5) {
                int.reply({ content: 'Sit tight, this might take a minute.', ephemeral: true });
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