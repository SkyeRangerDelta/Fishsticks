//----PURGE----

const permissionsCheck = require('../../Modules/Functions/permissionsCheck.js');

exports.run = async (fishsticks, msg, cmd) => {

    //Permissions check
    let perms = {"perms": ["Staff", "Moderator", "Bot"]}
    if (!permissionsCheck.run(fishsticks, msg.member, perms)) {
        return msg.reply("You don't have the authority to purge messages!").then(msg => msg.delete);
    }

    let targetChannel = msg.channel;

    console.log("[PURGE] No user found, executing general deletion.");

    let count = parseInt(cmd[0]) + 1;
    let targetChannelMsgs = await targetChannel.fetchMessages({limit: count});

    if (count > 5) {
        msg.reply("Sit tight, this might take a minute.").then(sent => sent.delete(7000));
    }

    console.log("[PURGE] Deleting " + count + " target messages...");

    targetChannelMsgs.forEach(deleteItems);

    async function deleteItems(key, value, map) {
        let messageItem = value;

        await targetChannel.fetchMessage(messageItem).then(msgColl => {
            console.log("[PURGE] Target Content: " + msgColl.content)
            msgColl.delete();
            console.log("[PURGE] Removed.");
        })
    }
}