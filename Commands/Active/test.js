//---TEST SQL---
const query = require('../../Modules/Functions/db/query.js');
const syslog = require('../../Modules/Functions/syslog.js');

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    return msg.reply('Command deactivated until V18 fixes. Ask staff for support.').then(sent => sent.delete({timeout: 10000}));

    syslog.run(fishsticks, "[SQL-SYS] Test command detected.", 4);

    if (msg.author == fishsticks.ranger) {
        msg.channel.send("Sending...");
        let result = await query.run(fishsticks, cmd.join(' '));
        msg.channel.send("Here you are admiral:");
        msg.channel.send(result);
        msg.channel.send("Stringified:");
        msg.channel.send(JSON.stringify(result));
        msg.channel.send("And accessed to first iteration:");
        msg.channel.send(result[0]).catch(error => msg.channel.send(error));
    } else {
        return msg.reply("Whoa whoa, no. The hardest choices require the strongest wills. This is one such command that you cannot run.").then(sent => sent.delete({timeout: 10000}));
    }

}