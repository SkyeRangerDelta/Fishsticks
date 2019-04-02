//----PING STATS----

const rolesJSON = JSON.parse(fs.readFileSync("./Modules/GameRoles/gameRoles.json", 'utf8'));

exports.run = (fishsticks, msg, cmd) => {

    const ping = cmd[0].replace(/[\\<>@#&!]/g, "");
    const role = msg.guild.roles.get(ping);
    const roleName = role.name;

    for (role in rolesJSON.roles) {
        
    }
}