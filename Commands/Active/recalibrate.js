//----RECALIBRATE----
// Syncs the Discord Game roles with that of FSO in a one-way connection

const mysql = require('promise-mysql');
const fs = require('fs');

const gameRolesJSON = "./Modules/GameRoles/gameRoles.json";

const syslog = require('../../Modules/Functions/syslog.js');
const db = require('../../Modules/Functions/db/db.json');
const date = require('../../Modules/Functions/currentDateTime.js');
const fsoVerify = require('../../Modules/Functions/FSO/verifyMember.js');

exports.run = async (fishsticks, msg, cmd) => {

    if (msg.author != fishsticks.ranger) {
        return msg.reply("This is a command, that should not be toyed with. Ask Ranger to run it instead.").then(sent => sent.delete(7000));
    }

    function log(message) {
        syslog.run(fishsticks, "[RECALIBRATION] " + message, 4);
    }

    msg.delete();
    let statusMessage = null;

    function initEdit(message) {
        statusMessage = message;
    }

    function statusUpdate(message) {
        statusMessage.edit("|`STATUS:`| " + message);
    }

    //Prevent multiple recalibrations
    log("INTIALIZING");
    msg.reply("Starting recalibration, give me a moment, that's a lot of data.").then(sent => sent.delete(15000));
    msg.channel.send("Watch the Fishsticks System Log for details.").then(sent => sent.delete(15000));
    statusMessage = await msg.channel.send("|`Status:`| Initializing");
    fishsticks.recalibrating = true;

    //Get the Discord roles list and specify the Game Roles from them
    let guildRoles = msg.guild.roles;
    let gameRoles = [];

    function processRole(value, key, map) {
        if (value.hexColor === "#9e876e") {
            gameRoles.push(value);
            log("Collected game role: " + value.name);
        }
    }

    guildRoles.forEach(processRole);

    //Open a connection to FSO
    let FSOConnection = await mysql.createConnection({
        host: db.db_host,
        user: db.db_user,
        password: db.db_pass,
        port: db.db_port,
        database: db.db_db,
        supportBigNumbers: true
    }).then(log("FSO Conduit Opened."));

    //Sift through game roles and sync data
    let FSOGameRoles = await FSOConnection.query(`SELECT * FROM fs_gr_Roles`);

    if (FSOGameRoles.length != gameRoles.length) {
        log(`FSO Roles: ${FSOGameRoles.length}\nGuild Roles: ${gameRoles.length}\nRole listings are not of equal length, beginning FSO sync.`);
        msg.channel.send("FSO desynced. Starting recalibration.");
    } else {
        msg.channel.send("No recalibration needed. Records match. If there is doubt, perhaps a manual check is in order?");
    }

    //Stage 1: Determine pre-existing roles
    log("[Stage 1] SORTING PRE-EXISTING ROLES");
    statusUpdate("Stage 1/5 - Sorting out duplicates");
    let knownRoles = [];

    for (FSORole in FSOGameRoles) {
        for (gameRole in gameRoles) {
            log(`Comparing ${FSOGameRoles[FSORole].name} and ${gameRoles[gameRole].name}`)
            if (FSOGameRoles[FSORole].name == gameRoles[gameRole].name) {
                log("Sorted out " + gameRoles[gameRole].name);
                knownRoles.push(gameRoles.pop(gameRoles[gameRole]));
            }
        }
    }

    //Stage 2: Parsing Metadata and Syncing to roles
    log("[Stage 2] PARSING METADATA");
    statusUpdate("Stage 2/5 - Converting old game roles.");
    let processedRoles = [];
    let JSONRoles = JSON.parse(fs.readFileSync(gameRolesJSON, 'utf8'));

    for (roleObj in JSONRoles.roles) {

        log(`Converting role ${roleObj} of ${JSONRoles.roles.length}`);

        let processedRoleObj = {
            name: JSONRoles.roles[roleObj].name,
            game: JSONRoles.roles[roleObj].game,
            division: JSONRoles.roles[roleObj].division,
            description: JSONRoles.roles[roleObj].description,
            id: 000000000000000000,
            official: JSONRoles.roles[roleObj].official,
            votes: JSONRoles.roles[roleObj].votes,
            pings: JSONRoles.roles[roleObj].pings,
            lastPing: JSONRoles.roles[roleObj].lastPing,
            numMembers: JSONRoles.roles[roleObj].members.length
        }

        if (processedRoleObj.official) {
            processedRoleObj.official = 1;
        } else {
            processedRoleObj.official = 0;
        }

        processedRoles.push(processedRoleObj);
    }

    //Stage 3: Create missing roles in FSO
    log("[Stage 3] CREATING MISSING RECORDS");
    statusUpdate("Stage 3/5 - Uploading/Syncing records");

    let rolesAdded = 0;

    for (roleItem in processedRoles) {
        log("Adding record " + roleItem);
        let response = await FSOConnection.query(`INSERT INTO fs_gr_Roles (name, game, division, description, roleDiscordID, official, votes, pings, lastPing, numMembers, created) `+ 
                                                `VALUES ("${processedRoles[roleItem].name}", "${processedRoles[roleItem].game}", "${processedRoles[roleItem].division}", "${processedRoles[roleItem].description}",`+
                                                ` ${processedRoles[roleItem].id}, ${processedRoles[roleItem].official}, ${processedRoles[roleItem].votes}, ${processedRoles[roleItem].pings}, "${processedRoles[roleItem].lastPing}",`+
                                                `${processedRoles[roleItem].members}, "${date.run(fishsticks)}");`);
        if (response.affectedRows != 1) {
            return msg.reply("Recalibration aborted; record insertion fault at sequence " + roleItem + " has resulted in unexpected changes.").then(sent => sent.delete(10000));
        }

        rolesAdded++;
    }

    log(`FSO receieved ${rolesAdded} new records successfully.`);
    msg.channel.send(`FSO received ${rolesAdded} new records successfully.`).then(sent => sent.delete(10000));

    //Stage 4: Verify integrity - pass 1/2
    log("[Stage 4] VERIFYING INTEGRITY");
    statusUpdate("Stage 4/5 - Verification Check");

    let newFSOGameRoles = await FSOConnection.query(`SELECT * FROM fs_gr_Roles`);
    let originalRoleCount = gameRoles.length + knownRoles.length;

    if (newFSOGameRoles.length == originalRoleCount) {
        log(`FSO Role count: ${newFSOGameRoles.length}\nOriginal Role Count: ${originalRoleCount}\nRecords match, moving on.`);
    }

    //Stage 5: Sync memberships
    log("[STAGE 5] SYNCING MEMBER STATES");
    statusUpdate("Stage 5/5 - Syncing Member States - Verifying Member FSO Records");

    let memberCount = 0;

    for (gameRoleB in JSONRoles.roles) {
        for (gameRoleMember in JSONRoles.roles[gameRoleB].members) {
            fsoVerify.run(fishsticks, msg.guild.members.get(JSONRoles.roles[gameRoleB].members[gameRoleMember]));
        }

        memberCount += JSONRoles.roles[gameRoleB].members.length;
    }

    statusUpdate("Stage 5/5 - Syncing Member States - Assigning roles");
    for (gameRoleB in JSONRoles.roles) {
        for (gameRoleMember in JSONRoles.roles[gameRoleB].members) {
            let memberID = await FSOConnection.query(`SELECT memberID FROM fs_members WHERE memberDiscordID = ${JSONRoles.roles[gameRoleB].members[gameRoleMember]}`);
            let roleID = await FSOConnection.query(`SELECT roleID FROM fs_gr_Roles WHERE name = "${JSONRoles.roles[gameRoleB].name}"`);

            if (roleID.length != 1) {
                roleID = await FSOConnection.query(`SELECT roleID FROM fs_gr_Roles WHERE name = "${JSONRoles.roles[gameRoleB].game}"`);
            }

            if (roleID != 1) {
                return msg.reply("Recalibration aborted; a roleID collection failed when the proper name for the role could not be ascertained from the list.");
            }

            let response = await FSOConnection.query(`INSERT INTO fs_gr_MemberRoles (memberID, roleID) VALUES (${memberID[0].memberID}, ${roleID[0].roleID});`);
        }
    }
    

    //Recalibration complete
    FSOConnection.end();
    statusUpdate("Done.");
    msg.reply("Recalibration complete. FSO banks synced to CCG's Discord.").then(sent => sent.delete(10000));
    fishsticks.recalibrating = false;
}