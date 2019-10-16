//----PURGE----

const permissionsCheck = require('../../Modules/Functions/permissionsCheck.js');

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete();

    //Permissions check
    let perms = {"perms": ["Staff", "Moderator", "Bot"]}
    if (!permissionsCheck.run(fishsticks, msg.member, perms)) {
        return msg.reply("You don't have the authority to purge messages!").then(msg => msg.delete);
    }

    //Gen information
    let targetChannel = msg.channel;

    //Check first parameter for a specific user
    if (msg.mentions.users.first != null || msg.mentions.users.first != undefined) {
        //No user mention found, execute general message deletion
        console.log("[PURGE] No user found, executing general deletion.");

        let count = parseInt(cmd[0]) + 1;
        let targetChannelMsgs = await targetChannel.fetchMessages({limit: count});

        console.log("[PURGE] Deleting " + count + " target messages...");

        targetChannelMsgs.forEach(deleteItems);

    } else {
        //Specific user found, collect messages and remove last of them
        console.log("[PURGE] Target User Found, executing targeted deletion.");

        let count = parseInt(cmd[1]);
        let targetUser = msg.mentions.users.first;
        let targetUserID = targetUser.id;

        if (count == 0) {
            let targetChannelMsgs = await targetChannel.fetchMessages().then(pulledMsgs => {
                let filteredMsgs = pulledMsgs.filter(m => m.author.id === targetUserID);
            })
        }

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