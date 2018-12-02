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

    let ark = msg.guild.roles.find('name', 'Ark: SE');
    if (msg.member.roles.find('name', 'Ark: SE')) {

        msg.member.removeRole(ark);

        msg.reply("Ark Role Removed.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] ARK removed from " + msg.author.tag);
        syslog("[ROLE-ASN] ARK removed from " + msg.author.tag, 1);
    }
    else {

        msg.member.addRole(ark);

        msg.reply("Ark Role Assigned.").then(sent => sent.delete(10000));

        console.log("[ROLE-ASN] ARK assigned to " + msg.author.tag);
        syslog("[ROLE-ASN] ARK assigned to " + msg.author.tag, 1);
    }
}