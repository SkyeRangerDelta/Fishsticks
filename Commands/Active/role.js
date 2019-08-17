//------GAME ROLE SUBROUTINE-------
//=================================

const Discord = require("discord.js");
const colors = require('colors');
const fs = require('fs');

const sysLogFunc = require('../../Modules/Functions/syslog.js');
const config = require('../../Modules/Core/corecfg.json');
const cpf = require('../../Modules/Functions/cpf.js');

const dateTime = require('../../Modules/Functions/currentDateTime.js');
const dbQuery = require('../../Modules/Functions/db/query.js');

let categories = require('../../Modules/GameRoles/categories.json');

let rolesJSON = JSON.parse(fs.readFileSync("./Modules/GameRoles/gameRoles.json", 'utf8'));

exports.run = (fishsticks, msg, cmd) => {

    msg.delete();

    if (!msg.member.roles.find("name", "Recognized")) {
        return msg.reply("You need to be at least Recognized in order to use this!").then(sent => sent.delete(10000));
    }

    //System logger
    function syslog(message, level) {
        sysLogFunc.run(fishsticks, "[GAME-ROLES] " + message, level);
    }

    //Verify routine online
    if (!(fishsticks.subroutines.get("gamerole"))) {
        syslog("Routine disabled, ignoring.", 3);
        return msg.reply("The game roles subroutine is currently disabled, ask " + fishsticks.ranger + " to turn it back on!");
    }

    syslog("Routine online, proceeding...", 2);

    //COMMAND BREAKUP
    cmdRef = msg.content.toLowerCase().split("-");
    cmdRef2 = msg.content.split("-");
    console.log("CommandRef: " + cmdRef)

    let cmdFunction;
    let roleName;
    let relatedGame;

    if (cmdRef[1] != null || cmdRef[1] != undefined) {
        cmdFunction = cmdRef[1].trim();
    }
    else {
        return msg.reply("You need to state what your intentions are!").then(sent => sent.delete(10000));
    }

    if (cmdRef[2] != null || cmdRef[2] != undefined) {
        roleName = cmdRef2[2].trim();
    }

    //Branch parameters                 Syntax: !role -[function]
    switch (cmdFunction) {
        case "list":
            listRoles();
            break;
        case "join":
            joinRole();
            break;
        case "vote":
            voteRole();
            break;
        case "create":
            createRole();
            break;
        case "leave":
            leaveRole();
            break;
        case "show":
            showRole();
            break;
        default:
        syslog("Incomplete parameters.", 2)
            return msg.reply("I feel like we were getting somewhere, but I just don't see it. Did you mean one of these?\n`-list`, `-join`, `-vote`, `-create`, `-leave`, `-show`").then(sent => sent.delete(15000));
    }

    //FUNCTIONS
    function listRoles() {

        if (cmdRef[2] == "divisions") {

            let catsList = "";

            for (item in categories.cats) {
                catsList = catsList.concat("- **" + categories.cats[item].name + "**: " + categories.cats[item].desc + "\n");
            }

            let catListEmbed = new Discord.RichEmbed();
                catListEmbed.setTitle("o0o - Game Divisions Listing - o0o");
                catListEmbed.setColor(config.fscolor);
                catListEmbed.setFooter("List will delete itself in 30 seconds. List was summoned by " + msg.author.username);
                catListEmbed.setDescription("All game roles in CC fall under at least one division. When you create a role, you have to specify one of these following divisions.");
                catListEmbed.addField("Divisions", catsList);
            
            return msg.channel.send({embed: catListEmbed}).then(sent => sent.delete(30000));
        }

        syslog("Attempting role list...", 2);

        let officialRoles = "";
        let unofficialRoles = "";
        let oRoleCount = 0;
        let uRoleCount = 0;

        for (role in rolesJSON.roles) {
            if (rolesJSON.roles[role].official) {
                officialRoles = officialRoles.concat("- " + capitalizeWord(rolesJSON.roles[role].name) + " : " + capitalizeWord(rolesJSON.roles[role].game) + "\n");
                oRoleCount++;
            } else {
                unofficialRoles = unofficialRoles.concat("- " + capitalizeWord(rolesJSON.roles[role].name) + " : " + capitalizeWord(rolesJSON.roles[role].game)  + " (Votes: " + rolesJSON.roles[role].votes + ")\n");
                uRoleCount++;
            }
        }

        if (oRoleCount == 0) {
            officialRoles = "Whoa, there's like....nothing here.";
        }

        if (uRoleCount == 0) {
            unofficialRoles = "Really? Nothing here? Crazy...";
        }

        let listEmbed = new Discord.RichEmbed();
            listEmbed.setTitle("o0o - Game Roles Listing - o0o");
            listEmbed.setColor(config.fscolor);
            listEmbed.setFooter("List will delete itself in 30 seconds. List was summoned by " + msg.author.username);
            listEmbed.setDescription("Game Roles are CC's way of letting players get to know who else plays a game and allows ease of contact when searching for players to join a game. These are the official and unofficial game roles recognized by CC.");
            listEmbed.addField("Offical Roles", "__These roles are currently in effect.__\n" + officialRoles, false);
            listEmbed.addField("Unofficial Roles", "__These roles need to be voted on before they are created.\n__" + unofficialRoles, false);

        return msg.channel.send({embed: listEmbed}).then(sent => sent.delete(30000));
    }

    function joinRole() {
        syslog("Attempting role join...", 2);

        let roleToAdd;

        try {
            msg.member.addRole(msg.mentions.roles.first);
            return;
        } catch {
            console.log("[GAME-ROLES] First join pass failed...");
        }

        try {
            roleToAdd = msg.guild.roles.find("name", roleName.charAt(0).toUpperCase() + roleName.slice(1));
            msg.member.addRole(roleToAdd).catch(error => {
                console.log("[GAME-ROLES] Role Join Error!");
                msg.reply("Was that an actual role?").then(sent => sent.delete(15000));
                return cpf.run(fishsticks, msg);
            });
        } catch (GameRoleAddErr) {
            msg.reply("It would seem I couldn't find the role " + roleName.charAt(0).toUpperCase() + roleName.slice(1) + " did you spell it right?").then(sent => sent.delete(15000));
        }

    }

    function leaveRole() {
        syslog("Attempting role leave...", 2);

        let roleToAdd;

        try {
            msg.member.removeRole(msg.mentions.roles.first)
        } catch (WrongErr) {
            console.log("[GAME-ROLES] Leave role first pass failed...");
        }

        try {
            roleToAdd = msg.guild.roles.find("name", roleName.charAt(0).toUpperCase() + roleName.slice(1));
            msg.member.removeRole(roleToAdd).catch(error => {
                console.log("[GAME-ROLES] Role Leave Error!");
                msg.reply("Was that an actual role?").then(sent => sent.delete(15000));
                return cpf.run(fishsticks, msg);
            });
        } catch (GameRoleAddErr) {
            msg.reply("It would seem I couldn't find the role " + roleName.charAt(0).toUpperCase() + roleName.slice(1) + " did you spell it right?").then(sent => sent.delete(15000));
        }
    }

    async function voteRole() {
        syslog("Attempting role vote...", 2);
        syslog("Vote Information:\n\tUser: " + msg.author.username + "\n\tRole Game/Name: " + roleName);

        let roleOfficialized = false;
        let roleFound = false;

        let memberID;
        let roleID;

        let newNumResults;

        if (roleName == null || roleName == undefined) {
            return msg.reply("You have to specify what role you're voting for!");
        }

        //Info Collection
        //Get member ID and Role ID
        syslog("[GAME-ROLE] [VOTE] Collecting Role...", 2);
        let roleIDQuery = await dbQuery.run(fishsticks, `SELECT roleID FROM fs_gr_Roles WHERE name = '${capitalizeWord(roleName)}';`);
        try {
            roleID = roleIDQuery[0].roleID;
        } catch (collectID) {
            return msg.reply("Hmmm, seems this role doesn't exist anymore.");
        }
        console.log("Collected: " + roleID);

        syslog("[GAME-ROLE] [VOTE] Collecting Member...", 2);
        let memberIDQuery = await dbQuery.run(fishsticks, `SELECT memberID FROM fs_members WHERE memberDiscordID = ${msg.author.id}`);
        memberID = memberIDQuery[0].memberID;
        console.log("Collected: " + memberID);

        //Process vote duplicate/not-necessary logic

        // -> Check if official
        let responseOfficial = await dbQuery.run(fishsticks, `SELECT official FROM fs_gr_Roles WHERE name = '${capitalizeWord(roleName)}'`);
        console.log(responseOfficial[0].official);
        if (responseOfficial[0].official != 0) {
            return msg.reply(capitalizeWord(roleName) + " is already official!").then(sent => sent.delete(15000));
        }

        //Check if member already voted for role 
        let dupeCheckResponse = await dbQuery.run(fishsticks, `SELECT memberID FROM fs_gr_memberVotes WHERE roleID = ${roleID};`);
        for (person in dupeCheckResponse) {
            if (dupeCheckResponse[person].memberID == memberID) {
                return msg.reply("Oi, come off it mate; you've already for this role.").then(sent => sent.delete(15000));
            }
        }

        // -> Check number of votes
        let response = await dbQuery.run(fishsticks, `SELECT votes FROM fs_gr_Roles WHERE name = '${capitalizeWord(roleName)}';`);
        let numResults = response[0].votes;
        console.log(numResults);

        if (numResults < 5) {
            //Process vote

            //Add to votes and increment
            syslog("[GAME-ROLE] [VOTE] Updating votes table...", 2);
            let voteResponse = await dbQuery.run(fishsticks, `INSERT INTO fs_gr_memberVotes (memberID, roleID) VALUES (${memberID}, ${roleID});`);

            syslog("[GAME-ROLE] [VOTE] Updating roles table...", 2);
            let incrementResponse = await dbQuery.run(fishsticks, `UPDATE fs_gr_Roles SET votes = ${numResults + 1} WHERE roleID = ${roleID};`);

            //Recalculate votes for response
            syslog("[GAME-ROLE] [VOTE] Validating votes count...", 2);
            let votesTalley = await dbQuery.run(fishsticks, `SELECT votes FROM fs_gr_Roles WHERE roleID = ${roleID}`);
            newNumResults = votesTalley[0].votes;
            syslog("[GAME-ROLE] [VOTE] Calculated " + newNumResults, 2);

            //Handle response
            if (newNumResults == 5) {
                msg.reply(capitalizeWord(roleName) + " has 5 votes, officializing!");
                officialize();
            } else if (newNumResults < 5) {
                return msg.reply(capitalizeWord(roleName) + " needs " + (5 - newNumResults) + " to be official!").then(sent => sent.delete(20000));
            }
        } else {
            return msg.reply("Seems this role has already achieved 5 votes.").then(sent => sent.delete(15000));
        }
    }

    async function createRole() {

        //EXPERIMENTAL
        let roleGame;
        let roleDivi;
        let roleDesc;
        let roleDate = dateTime.run(fishsticks);
        let sqlStatement;

        let memberID;
        let roleID;

        if (notNull(cmdRef[3])) {
            roleGame = cmdRef2[3].trim();
        }

        if (notNull(cmdRef[4])) {
            roleDivi = await compareCats();

            if (roleDivi == -1) {
                return msg.reply("You need to specify a proper division to list the role in! Check !role -list -divisions").then(sent => sent.delete(15000));
            }
        }

        if (notNull(cmdRef[5])) {
            roleDesc = cmdRef[5].trim();
        }

        //Collect info
        syslog("[GAME-ROLE] [CREATE] Collecting Member...", 2);
        let memberIDQuery = await dbQuery.run(fishsticks, `SELECT memberID FROM fs_members WHERE memberDiscordID = ${msg.author.id}`);
        memberID = memberIDQuery[0].memberID;
        console.log("Collected: " + memberID);

        //Create SQL to submit to DB
        let uniqueID = createID();
        sqlStatement = `INSERT INTO fs_gr_Roles (name, game, division, description, official, votes, pings, lastPing, numMembers, created) VALUES ('${roleName}', '${roleGame}', '${roleDivi}', '${roleDesc}', 0, 1, 0, '${roleDate}', 1, '${roleDate}');`;

        //Submit the SQL and log results
        let response = await dbQuery.run(fishsticks, sqlStatement);
        if (response.affectedRows == 1) {
            msg.reply("Role created!").then(sent => sent.delete(15000));
        }

        syslog("[GAME-ROLE] [CREATE] Collecting Role...", 2);
        let roleIDQuery = await dbQuery.run(fishsticks, `SELECT roleID FROM fs_gr_Roles WHERE name = '${capitalizeWord(roleName)}';`);
        roleID = roleIDQuery[0].roleID;
        console.log("Collected: " + roleID);

        //Add creator to votes table
        let voteAddResponse = await dbQuery.run(fishsticks, `INSERT INTO fs_gr_memberVotes (memberID, roleID) VALUES (${memberID}, ${roleID})`);
    }

    function showRole() {
        syslog("Attempting show role...", 2);

        if (cmdRef[2] == null || cmdRef[2] == undefined) {
            return msg.reply("Nah, not how it works. If you wanna see something, you gotta tell me what it is.").then(sent => sent.delete(15000));
        }

        let roleNum;
        for (role in rolesJSON.roles) {
            if (rolesJSON.roles[role].name == roleName || rolesJSON.roles[role].game == roleName) {
                roleNum = role;
            }
        }

        let memberList = "";
        for (aMember in rolesJSON.roles[roleNum].members) {
            let user = fishsticks.users.get(rolesJSON.roles[roleNum].members[aMember]);
            memberList = memberList.concat("- " + user.username + "\n");
        }

        let roleDetail = new Discord.RichEmbed();
            roleDetail.setTitle("o0o - " + capitalizeWord(cmdRef[2]) + " - o0o");
            roleDetail.setColor(config.fscolor);
            roleDetail.setFooter("This menu will disappear in 30 seconds. Report was summoned by " + msg.author.username);
            roleDetail.setDescription(rolesJSON.roles[roleNum].description);
            roleDetail.addField("Official?", convertBool(rolesJSON.roles[roleNum].official), true);
            roleDetail.addField("Division", capitalizeWord(rolesJSON.roles[roleNum].division), true);
            roleDetail.addField("Members", memberList, false);
            roleDetail.setThumbnail(grabImage(rolesJSON.roles[roleNum].division));

        msg.channel.send({embed: roleDetail}).then(sent => sent.delete(30000));
    }

    async function officialize() {
        //OFFICIALIZE THE ROLE
        //--------------------------------------------------------
        syslog("[GAME-ROLE] Attempting role officialization...", 2);

        let roleCount = fishsticks.CCGuild.roles.size;
        let role = capitalizeWord(cmdRef[2]);
        let newRole;

        fishsticks.CCGuild.createRole({
            name: role,
            color: '#9e876e',
            mentionable: true,
            position: roleCount
        }, "Fishsticks' [GAME-ROLE] Subroutine has created a new role based on the votes of 5 different members.").then(createdRole => newRole = createdRole);

        //Change role row to official
        let response = await dbQuery.run(fishsticks, `ALTER TABLE fs_gr_Roles SET official = 1 WHERE name = '${role}';`);

        //ASSIGN ROLE TO VOTERS
        //--------------------------------------------------------
        console.log("[GAME-ROLE] Collecting role info...");

        //Get role info
        let responseA = await dbQuery.run(fishsticks, `SELECT roleID FROM fs_gr_Roles WHERE name = '${role}';`);
        console.log("[GAME-ROLE] Role ID: " + responseA[0]);
        console.log("[GAME-ROLE] Collecting role voters...");

        //Collect Voters
        let responseB = await dbQuery.run(fishsticks, `SELECT memberID FROM fs_members JOIN fs_gr_memberVotes USING (${responseA[0]});`);

        //Execute SQL to add role to member
        console.log("[GAME-ROLE] Beginning role assignments.");

        for (record in responseB) {
            console.log("[GAME-ROLE] Assigning role " + responseA[0].roleID + " to member " + responseB[record].memberID);
            await dbQuery.run(fishsticks, `INSERT INTO fs_gr_MemberRoles (memberID, roleID) VALUES (${responseB[record].memberID}, ${responseA[0].roleID};)`);
        }

        console.log("[GAME-ROLE] Assignments complete.");

        //Assign Discord role to Voters


        /*
        for (roleItem in rolesJSON.roles) {
            if (rolesJSON.roles[roleItem].game == cmdRef[2].toLowerCase()) {
                console.log("Found proper key: " + rolesJSON.roles[roleItem].game);
                for (member in rolesJSON.roles[roleItem].members) {
                    await msg.guild.fetchMember(fishsticks.users.get(rolesJSON.roles[roleItem].members[member]), 1).then(person => {
                        console.log("Listing fetched members: " + person);
                        person.addRole(newRole);
                    });
                }
            }
        }
        */

    }

    function capitalizeWord(word) {
        return word.charAt(0).toUpperCase() + word.substring(1, word.length);
    }

    async function compareCats() {
        console.log("Running division comparison...");
        let cats = await dbQuery.run(fishsticks, "SELECT * FROM fs_gr_Divisions").then(console.log(colors.red("Completed division response.")));

        for (cat in cats) {

            console.log("Processing " + cats[cat].name);

            if (cmdRef[4].toLowerCase().trim() == cats[cat].name.toLowerCase()) {
                return cats[cat].name;
            }
        }

        return -1;
    }

    function convertBool(state) {
        if (state) {
            return "Yes";
        } else {
            return "No";
        }
    }

    function grabImage(div) {
        div = div.replace(" ", "-");
        console.log("[GAME-ROLE] Div link: " + div);
        return `https://cf.pldyn.net/wp-content/uploads/2019/03/${div}.png`;
    }

    function notNull(item) {
        if (item != null || item != undefined || item != NaN) {
            return true
        } else {
            return false;
        }
    }

    function createID() {
        let code = Math.random().toString(36).replace('0.', '');
        sysLogFunc.run(fishsticks, "[ROLE-SYS] Generated role ID: " + code);
        return code;
    }



}