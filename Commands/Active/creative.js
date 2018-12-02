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

    let creative = msg.guild.roles.find('name', 'Creative');
    if (msg.member.roles.find('name', 'Creative')) {
        msg.member.removeRole(creative);
        msg.reply("Creative Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Creative removed from " + msg.author.tag);
        syslog("[ROLE-ASN] Creative removed from " + msg.author.tag, 1);
    }
    else {
        msg.member.addRole(creative);
        msg.reply("Creative Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] Creative assigned to " + msg.author.tag);
        syslog("[ROLE-ASN] Creative assigned to " + msg.author.tag, 1);
    }
}