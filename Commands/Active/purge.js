//----PURGE----

const permissionsCheck = require('../../Modules/Functions/permissionsCheck.js');

exports.run = async (fishsticks, msg, cmd) => {

    //Permissions check
    let perms = {"perms": ["Staff", "Moderator", "Bot"]}
    if (!permissionsCheck.run(fishsticks, msg.member, perms)) {
        return msg.reply("You don't have the authority to purge messages!").then(msg => msg.delete);
    }

    //Gen information
    let targetChannel = msg.channel;
    let targetUserID = cmd[0].replace(/[\\<>@#&!]/g, "");
    let targetUser = fishsticks.users.get(targetUserID);

    //Check first parameter for a specific user
    if (!targetUser || targetUser == null || targetUser == undefined) {
        //No user mention found, execute general message deletion
        console.log("[PURGE] No user found, executing general deletion.");

        let count = parseInt(cmd[0]) + 1;
        let targetChannelMsgs = await targetChannel.fetchMessages({limit: count});

        console.log("[PURGE] Deleting " + count + " target messages...");

        targetChannelMsgs.forEach(deleteItems);

    } else {

        msg.delete();

        //Specific user found, collect messages and remove last of them
        console.log("[PURGE] Targeted purge detected, executing targeted deletion.");

        let count = parseInt(cmd[1]);

        console.log("[PURGE] Target message count: " + count);

        if (!count || count == NaN || count == undefined) {
            return msg.reply("You need to specify a number of messages to delete!").then(msg => msg.delete(15000));
        }

        console.log("[PURGE] Target user ID: " + targetUserID);

        if (!targetUserID || targetUserID == undefined || targetUserID == NaN) {
            return msg.reply("[PURGE] No user could be found!").then(msg => msg.delete(15000));
        }

        let targetChannelMsgs;
        let warningMsg;

        msg.channel.send("This may take a moment, standby.").then(t => t.delete(7000));

        if (count != 0) {
            console.log("[PURGE] Targeted purge with count: " + count);
            targetChannelMsgs = await targetChannel.fetchMessages().then(recMsgs => {
                let themMsgs = await recMsgs.filter(t => t.author.id === targetUserID);
                let themLimitedMsgs = themMsgs.last(count);
                return themLimitedMsgs.forEach(deleteItems);
            })
        } else {
            console.log("[PURGE] Targeted purge with no count.");
            targetChannelMsgs = await targetChannel.fetchMessages().then(m => m.filter(t => t.author.id === targetUserID));
        }

        if (!targetChannelMsgs || targetChannelMsgs.size == 0) {
            return msg.reply("I couldn't find any messages from that user in this channel!").then(msg => msg.delete(15000));
        }

        console.log("[PURGE] Attempting to delete " + count + " user targeted messages.");

        await targetChannelMsgs.forEach(deleteItems);

    }

    async function deleteItems(key, value, map) {
        let messageItem = value;

        await targetChannel.fetchMessage(messageItem).then(msgColl => {
            console.log("[PURGE] Target Content: " + msgColl.content)
            msgColl.delete();
            console.log("[PURGE] Removed.");
        })
    }
}