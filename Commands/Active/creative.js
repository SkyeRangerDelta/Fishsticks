const syslog = require("../../Modules/Functions/syslog.js");

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let creative = msg.guild.roles.find('name', 'Creative');
    if (msg.member.roles.find('name', 'Creative')) {
        msg.member.removeRole(creative);
        msg.reply("Creative Role Removed.").then(sent => sent.delete(10000));

        syslog(fishsticks, "[ROLE-ASN] Creative removed from " + msg.author.tag, 1);
    }
    else {
        msg.member.addRole(creative);
        msg.reply("Creative Role Assigned.").then(sent => sent.delete(10000));

        syslog(fishsticks, "[ROLE-ASN] Creative assigned to " + msg.author.tag, 1);
    }
}