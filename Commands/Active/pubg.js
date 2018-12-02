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

    let pubg = msg.guild.roles.find('name', 'PUBG');
    if (msg.member.roles.find('name', 'PUBG')) {
        msg.member.removeRole(pubg);
        msg.reply("PUBG Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] PUBG removed from " + msg.author.tag);
        syslog("[ROLE-ASN] PUBG removed from " + msg.author.tag, 1);
    }
    else {
        msg.member.addRole(pubg);
        msg.reply("PUBG Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] PUBG assigned to " + msg.author.tag);
        syslog("[ROLE-ASN] PUBG assigned to " + msg.author.tag, 1);
    }
}