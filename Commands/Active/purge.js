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
    .setDescription('[Mod+] Clears a number of posts from a channel or from a specific user in a channel.')
    .addIntegerOption(o => o
        .setName('post-count')
        .setDescription('How many posts to delete.')
        .setRequired(true))
    .addUserOption(o => o
        .setName('target-user')
        .setDescription('The user whose posts to delete.')
    );

//Functions
async function run(fishsticks, int) {
    return int.reply({
        content: 'This is a WIP, come back later.',
        ephemeral: true
    });
    await int.deferReply({ ephemeral: true });
    //Permissions check
    if (!hasPerms(int.member, ['Moderator', 'Council Member', 'Council Advisor'])) {
        return int.reply({ content: 'Your lack of permissions disturbs me.', ephemeral: true });
    }

    //Syntax: /purge post-count target-user?

    const targetChannel = int.channel;
    const count = int.options.getInteger('post-count');
    const targetMember = int.options.getMember('target-user');

    if (!targetMember) {
        log('info', '[PURGE] No user detected, initiating general deletion.');

        if (count === 0) {
            return int.reply({ content: 'No number specified, might as well just delete the whole channel if you want them all gone.', ephemeral: true });
        }

        const targetChannelMsgs = await targetChannel.messages.fetch({ limit: count });

        if (await delMsgs(targetChannelMsgs, targetChannel) === 1) {
            await int.editReply({ content: 'Ok done.', ephemeral: true });
        }
        else {
            await int.editReply({ content: 'Something is WRONG!', ephemeral: true });
        }
    }
    else {
        log('info', '[PURGE] Possible user specified, initiating targeted deletion.');

        if (count === 0) {
            log('warn', '[PURGE] No count specified, deleting all messages?');

            const targetChannelMsgs = await targetChannel.messages.fetch().then(m => m.filter(a => a.author.id === targetMember.id));

            if (await delMsgs(targetChannelMsgs, targetChannel) === 1) {
                await int.editReply({ content: 'Ok done.', ephemeral: true });
            }
            else {
                await int.editReply({ content: 'Something is WRONG!', ephemeral: true });
            }
        }
        else {

            const targetChannelMsgs = await targetChannel.messages.fetch({ limit: count }).then(m => m.filter(a => a.author.id === targetMember.id));

            if (await delMsgs(targetChannelMsgs, targetChannel) === 1) {
                await int.editReply({ content: 'Ok done.', ephemeral: true });
            }
            else {
                await int.editReply({ content: 'Something is WRONG!', ephemeral: true });
            }
        }
    }
}

function help() {
    return 'Administrative command allowing bulk message deletion.';
}

async function delMsgs(msgList, msgChannel) {
    try {
        for (const msgObj in msgList) {
            await msgChannel.messages.fetch(msgList[msgObj]).then(msgColl => {
                msgColl.delete();
            });
        }

        return 1;
    }
    catch (e) {
        return -1;
    }
}

//Exports
module.exports = {
    name: 'purge',
    data,
    run,
    help
}