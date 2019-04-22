//----EDIT ROLE----
const syslog = require('./syslog.js');

let rolesJSON = JSON.parse(fs.readFileSync('./GameRoles/gameRoles.json'));

exports.run = (fishsticks, role, method, id) => {
    if (method = "addMember") {
        for (item in rolesJSON.roles) {
            if (rolesJSON.roles[item] == role) {
                rolesJSON.roles[item].members.push(id);
            }
        }
    }
    else if (method = "removeMember") {
        for (item in rolesJSON.roles) {
            if (rolesJSON.roles[item] == role) {
                rolesJSON.roles[item].members.pop(id);
            }
        }
    }
}