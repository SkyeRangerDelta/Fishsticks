const syslog = require("../../Modules/Functions/syslog.js");

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    return msg.reply('Command deactivated until V18 fixes. Ask staff for support.').then(sent => sent.delete({timeout: 10000}));

    let creative = msg.guild.roles.cache.find('name', 'Creative');
    if (msg.member.roles.cache.find('name', 'Creative')) {
        msg.member.removeRole(creative);
        msg.reply("Creative Role Removed.").then(sent => sent.delete({timeout: 10000}));

        syslog(fishsticks, "[ROLE-ASN] Creative removed from " + msg.author.tag, 1);
    }
    else {
        msg.member.addRole(creative);
        msg.reply("Creative Role Assigned.").then(sent => sent.delete({timeout: 10000}));

        syslog(fishsticks, "[ROLE-ASN] Creative assigned to " + msg.author.tag, 1);
    }
}