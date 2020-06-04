//----PERMISSIONS CHECK SYSTEM----
const syslog = require("./syslog.js");

exports.run = (fishsticks, user, permissions) => {
    syslog.run(fishsticks, "[PERM-SYS] Checking user permissions...", 1);
    let userPerms = user.roles.cache;

    for (perm in permissions.perms) {
        if (userPerms.find(thePerm => thePerm.name == perm)){
            syslog.run(fishsticks, "[PERM-SYS] User passed check.", 1);
            return true;
        }
    }
    syslog.run(fishsticks, "[PERM-SYS] User failed check.", 1);
    return false;
}