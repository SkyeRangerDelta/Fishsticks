//----AFK----

const chs = require('../../Modules/fs_ids.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (cmd.length != 3) {
        return msg.reply("AFK has 3 words...").then(sent => sent.delete(10000));
    }

    let newName = "";
    
    if (cmd[0].toLowerCase().charAt(0) != 'a') {
        return msg.reply("(A)FK - The word needs to start with an A!").then(sent => sent.delete(7000));
    } else if (cmd[1].toLowerCase().charAt(0) != 'f') {
        return msg.reply("A(F)K - The word needs to start with an F!").then(sent => sent.delete(7000));
    } else if (cmd[2].toLowerCase().charAt(0) != 'k') {
        return msg.reply("AF(K) - The word needs to start with a K!").then(sent => sent.delete(7000));
    }

    newName = "AFK (" + cmd.join(' ') + ")";

    let AFKChannel = fishsticks.channels.get(chs.afkChannel);
    AFKChannel.setName(newName, "The AFK command was used!").then(t => msg.reply("Done!").then(sent => sent.delete(5000)));
}