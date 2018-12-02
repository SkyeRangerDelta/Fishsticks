const log = require('../../Modules/Functions/log.js');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //LOGGER
    function syslog(message, level) {
        try {
            log.run(fishsticks, message, level);
        }
        catch (err) {
            fishsticks.systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
        }
    }

    let overwatch = msg.guild.roles.find('name', 'Overwatch');
    if (msg.member.roles.find('name', 'Overwatch')) {
        msg.member.removeRole(overwatch);
        msg.reply("Overwatch Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Overwatch removed from " + msg.author.tag);
        syslog("[ROLE-ASN] Overwatch removed from " + msg.author.tag, 1);
    }
    else {
        msg.member.addRole(overwatch);
        msg.reply("Overwatch Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Overwatch assigned to " + msg.author.tag);
        syslog("[ROLE-ASN] Overwatch assigned to " + msg.author.tag, 1);
    }
}