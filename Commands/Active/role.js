//------GAME ROLE SUBROUTINE-------
//=================================

const Discord = require("discord.js");
const colors = require('colors');
const fs = require('fs');

const sysLogFunc = require('../../Modules/Functions/syslog.js');
const config = require('../../Modules/Core/corecfg.json');
const cpf = require('../../Modules/Functions/cpf.js');
const subCheck = require('../../Modules/Functions/subroutineCheck.js');

const dateTime = require('../../Modules/Functions/currentDateTime.js');
const dbQuery = require('../../Modules/Functions/db/query.js');

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
    if (!(subCheck.run(fishsticks, 'gamerole'))) {
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
        return msg.reply("You need to state what your intentions are!\nSee `!info role` for help.").then(sent => sent.delete(10000));
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
    async function listRoles() { //Generates a complete list of *all* roles.

        if (cmdRef[2] == "divisions") { //If thrown, print list of recognized divisions instead.

            let divList = await dbQuery.run(fishsticks, `SELECT * FROM fs_gr_Divisions;`);
            let catsList = "";
            let lastEntry = 1;

            for (item in divList) {
                if (item % 5 == 0 && item != 0) {
                    catsList = catsList.concat(`- **${divList[item].name}**: ${divList[item].description}\n`);
                    postList(catsList, lastEntry++);
                    catsList = "";
                } else {
                    catsList = catsList.concat(`- **${divList[item].name}**: ${divList[item].description}\n`);
                }
            }

            postList(catsList, lastEntry++); //Post anything less than 5 entries.
            catsList = "";
            return;
        }

        syslog("Attempting role list...", 2);

        let roles = await dbQuery.run(fishsticks, `SELECT * FROM fs_gr_Roles;`);
        let oRoleCount = 0;
        let uRoleCount = 0;

        let officialRoles = "";
        let unofficialRoles = "";

        for (role in roles) {
            if (roles[role].official == 1) {
                officialRoles = officialRoles.concat("- " + convertToTitleCase(roles[role].name) + " : " + convertToTitleCase(roles[role].game) + "\n");
                oRoleCount++;
            } else {
                unofficialRoles = unofficialRoles.concat("- " + convertToTitleCase(roles[role].name) + " : " + convertToTitleCase(roles[role].game)  + " (Votes: " + roles[role].votes + ")\n");
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

    //Subfunction - post embed (List)
    function postList(catsList, lastEntry) {
        if (lastEntry == 1) {
            let catListEmbed = new Discord.RichEmbed();
                catListEmbed.setTitle(`o0o - Game Divisions Listing [Page ${lastEntry}] - o0o`);
                catListEmbed.setColor(config.fscolor);
                catListEmbed.setFooter("List will delete itself in 30 seconds. List was summoned by " + msg.author.username);
                catListEmbed.setDescription("All game roles in CC fall under at least one division. When you create a role, you have to specify one of these following divisions.");
                catListEmbed.addField("Divisions", catsList);

            msg.channel.send({embed: catListEmbed}).then(sent => sent.delete(30000));
        } else {
            let catListEmbed = new Discord.RichEmbed();
                catListEmbed.setTitle(`o0o - Game Divisions Listing [Page ${lastEntry}] - o0o`);
                catListEmbed.setColor(config.fscolor);
                catListEmbed.setFooter("List will delete itself in 30 seconds. List was summoned by " + msg.author.username);
                catListEmbed.setDescription("Divisions, continued.");
                catListEmbed.addField("Divisions", catsList);

            msg.channel.send({embed: catListEmbed}).then(sent => sent.delete(30000));
        }
    }

    function joinRole() { //Join a role once officialized
        syslog("Attempting role join...", 2);

        let testRole = msg.guild.roles.find("name", "Bot");
        let roleToAdd;

        //Attempt role add from mention
        try {
            syslog("Attempting to add role based on mention...", 2);
            roleToAdd = msg.mentions.roles.first;

            if (typeof roleToAdd != typeof testRole) {
                throw "Invalid role type found!";
            }

            msg.member.addRole(roleToAdd);

            syslog("Success.", 2);
            return msg.reply("Role assigned!").then(sent => sent.delete(10000));
        } catch (addOnMentionErr) {
            try { //Attempt to add role based on name
                console.log("[GAME ROLES] Smacked an addOnMention:\n" + addOnMentionErr);
                syslog("Failed. Attempting to add role based on given value: " + cmdRef2[2], 2);
                let roleTitle = convertToTitleCase(cmdRef[2]);
                syslog("Reprocessed role name to " + roleTitle, 2);

                roleToAdd = msg.guild.roles.find("name", roleTitle);
                msg.member.addRole(roleToAdd);

                syslog("Success.", 2);
                return msg.reply("Role assigned!").then(sent => sent.delete(10000));
            } catch (addOnNameErr) {
                console.log("[GAME ROLES] Smacked an addOnName:\n" + addOnNameErr);
                syslog("Failed. Attempting to add role via game.", 2);
            }
        }

    }

    function leaveRole() { //Leave a role once officialized
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

    async function processRoleChange(shift, role) {
        //Process role change for user

        if (shift == 1) { //Adding role
            if (role == undefined) {
                return msg.reply("Mmmmm theres something wrong with that. I dunno what it is - but it doesn't look right.");
            } else {
                syslog("Adding role to member.", 1);
                msg.member.addRole(role);
            }

            //Begin DB Sync
            //Get role ID of role being added
            syslog("Collecting role ID.", 1);
            let roleID = await dbQuery.run(fishsticks, `SELECT roleID, official FROM fs_gr_Roles WHERE name = ${role.name}`);

            //Verify official
            if (roleID[0].official != 1) {
                syslog("Role returned unofficial.", 2);
                return msg.reply("Whoa whoa whoa, you can't swear up my roles system. Go find a role that's official first!").then(sent => sent.delete(15000));
            }

            //Get memberID of command issuer
            syslog("Collecting member ID.", 1);
            let memberID = await dbQuery.run(fishsticks, `SELECT memberID FROM fs_Members WHERE memberDiscordID = ${msg.author.id}`);

            //Add roleID and memberID to roles cross-table
            syslog("Assigning role in DB.", 1);
            let roleAddResult = await dbQuery.run(fishsticks, `INSERT INTO fs_gr_MemberRoles (memberID, roleID) VALUES (${memberID[0].memberID}, ${roleID[0].roleID});`);

        } else { //Removing role

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
        let roleIDQuery = await dbQuery.run(fishsticks, `SELECT roleID FROM fs_gr_Roles WHERE name = '${convertToTitleCase(roleName)}';`);
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
        let responseOfficial = await dbQuery.run(fishsticks, `SELECT official FROM fs_gr_Roles WHERE name = '${convertToTitleCase(roleName)}'`);
        console.log(responseOfficial[0].official);
        if (responseOfficial[0].official != 0) {
            msg.reply(convertToTitleCase(roleName) + " is already official, adding you to the role instead. (Negate this by running `!role -leave -[roleName]`)").then(sent => sent.delete(15000));
            return await voteRoleAssign();
        }

        //Check if member already voted for role 
        let dupeCheckResponse = await dbQuery.run(fishsticks, `SELECT memberID FROM fs_gr_memberVotes WHERE roleID = ${roleID};`);
        for (person in dupeCheckResponse) {
            if (dupeCheckResponse[person].memberID == memberID) {
                return msg.reply("Oi, come off it mate; you've already for this role.").then(sent => sent.delete(15000));
            }
        }

        // -> Check number of votes
        let response = await dbQuery.run(fishsticks, `SELECT votes FROM fs_gr_Roles WHERE name = '${convertToTitleCase(roleName)}';`);
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
                msg.reply(convertToTitleCase(roleName) + " has 5 votes, officializing!");
                officialize();
            } else if (newNumResults < 5) {
                return msg.reply(convertToTitleCase(roleName) + " needs " + (5 - newNumResults) + " to be official!").then(sent => sent.delete(20000));
            }
        } else {
            msg.reply("Seems this role has already achieved 5 votes, adding you to the role instead. (Negate this by running `!role -leave -[roleName]`)").then(sent => sent.delete(15000));
            return await voteRoleAssign();
        }
    }

    //If the role has been officialized, or otherwise reached 5 votes
    //add the user to the role instead of voting for it.
    async function voteRoleAssign() {
        try {
            let roleToAssign = msg.guild.roles.find("name", roleTitle);
            
        } catch (voteAltError) {
            
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
        sqlStatement = `INSERT INTO fs_gr_Roles (name, game, division, description, roleDiscordID, official, votes, pings, lastPing, numMembers, created) VALUES ('${convertToTitleCase(roleName)}', '${roleGame}', '${roleDivi}', '${roleDesc}', 0, 0, 1, 0, '${roleDate}', 1, '${roleDate}');`;

        //Submit the SQL and log results
        let response = await dbQuery.run(fishsticks, sqlStatement);
        if (response.affectedRows == 1) {
            msg.reply("Role created!").then(sent => sent.delete(15000));
        }

        syslog("[GAME-ROLE] [CREATE] Collecting Role...", 2);
        let roleIDQuery = await dbQuery.run(fishsticks, `SELECT roleID FROM fs_gr_Roles WHERE name = '${convertToTitleCase(roleName)}';`);
        roleID = roleIDQuery[0].roleID;
        console.log("Collected: " + roleID);

        //Add creator to votes table
        let voteAddResponse = await dbQuery.run(fishsticks, `INSERT INTO fs_gr_memberVotes (memberID, roleID) VALUES (${memberID}, ${roleID});`);
    }

    async function showRole() {
        syslog("Attempting show role...", 2);

        //Handle Division Report
        if (cmdRef[2].trim() == "division") {
            syslog("Incoming division report...", 1);

            return await handleDivisionReport();
        }

        if (cmdRef[2] == null || cmdRef[2] == undefined) {
            return msg.reply("Nah, not how it works. If you wanna see something, you gotta tell me what it is.").then(sent => sent.delete(15000));
        }

        //Collect role from FSO
        let roleResponse = await dbQuery.run(fishsticks, `SELECT * FROM fs_gr_Roles WHERE name = "${convertToTitleCase(cmdRef[2])}";`);

        if (roleResponse.length != 1) {
            //Possibly not a role, might be a division check
            return msg.reply("It seems I couldn't find that role in my databanks. Did you do a typo?").then(sent => sent.delete(10000));
        }

        //Create memberlist
        let memberList = "";
        let memberListResponse = await dbQuery.run(fishsticks, `SELECT memberID FROM fs_gr_MemberRoles WHERE roleID = ${roleResponse[0].roleID};`);

        if (memberListResponse.length > 10) {
            memberList = "There's too many to list! There's " + memberListResponse.length + " members in here!";
        } else {
            for (memberObjA in memberListResponse) {
                let memberUsername = await dbQuery.run(fishsticks, `SELECT memberNickname FROM fs_members WHERE memberID = ${memberListResponse[memberObjA].memberID};`);
                memberList = memberList.concat(`- ${memberUsername[0].memberNickname}\n`);
            }
        }

        if (memberList == undefined) {
            memberList = "*Looks pretty empty here.* ¯|_(ツ)_/¯";
        }

        let roleDetail = new Discord.RichEmbed();
            roleDetail.setTitle("o0o - " + roleResponse[0].name + " - o0o");
            roleDetail.setColor(config.fscolor);
            roleDetail.setFooter("This menu will disappear in 30 seconds. Report was summoned by " + msg.author.username);
            roleDetail.setDescription(roleResponse[0].description);
            roleDetail.addField("Official?", convertBool(roleResponse[0].official), true);
            roleDetail.addField("Division", convertToTitleCase(roleResponse[0].division), true);
            roleDetail.addField("Members", memberList, false);
            roleDetail.setThumbnail(grabImage(roleResponse[0].division));

        msg.channel.send({embed: roleDetail}).then(sent => sent.delete(30000));
    }

    async function officialize() {
        //OFFICIALIZE THE ROLE
        //--------------------------------------------------------
        syslog("[GAME-ROLE] Attempting role officialization...", 2);

        let roleCount = fishsticks.CCGuild.roles.size;
        let role = convertToTitleCase(cmdRef[2]);

        fishsticks.CCGuild.createRole({
            name: role,
            color: '#9e876e',
            mentionable: true,
            position: roleCount
        }, "Fishsticks' [GAME-ROLE] Subroutine has created a new role based on the votes of 5 different members.");

        let newRole = fishsticks.guild.find("name", role);
        let newRoleID = newRole.id;

        //Change role row to official
        let response = await dbQuery.run(fishsticks, `UPDATE fs_gr_Roles SET official = 1, roleDisord = ${newRoleID} WHERE name = '${role}';`);

        //ASSIGN ROLE TO VOTERS
        //--------------------------------------------------------
        console.log("[GAME-ROLE] Collecting role info...");

        //Get role info
        let responseA = await dbQuery.run(fishsticks, `SELECT roleID FROM fs_gr_Roles WHERE name = '${role}';`);
        console.log("[GAME-ROLE] Role ID: " + responseA[0]);
        console.log("[GAME-ROLE] Collecting role voters...");

        //Collect Voters
        let responseB = await dbQuery.run(fishsticks, `SELECT memberID, memberDiscordID FROM fs_members JOIN fs_gr_memberVotes USING (${responseA[0]});`);

        //Execute SQL to add role to member
        console.log("[GAME-ROLE] Beginning role assignments.");

        for (record in responseB) {
            console.log("[GAME-ROLE] Assigning role " + responseA[0].roleID + " to member " + responseB[record].memberID);
            await dbQuery.run(fishsticks, `INSERT INTO fs_gr_MemberRoles (memberID, roleID) VALUES (${responseB[record].memberID}, ${responseA[0].roleID};)`);
        }

        console.log("[GAME-ROLE] Assignments complete.");

        //Collect Discord members
        let membersToAssignRole = [];
        for (memberIDItem in responseB) {
            membersToAssignRole.push(msg.guild.members.get(`${responseB[memberIDItem].memberDiscordID}`));
        }

        //Assign Discord role to Voters
        let newlyCreatedRole = msg.guild.roles.find("name", role);

        for (memberObj in membersToAssignRole) {
            membersToAssignRole[memberObj].addRole(newlyCreatedRole);
            msg.channel.send(`${membersToAssignRole[memberObj]} - you've been auto-assigned ${role} because you voted for it!`).then(sent => sent.delete(10000));
        }
    }

    async function handleDivisionReport() {
        if (cmdRef[3].trim() == null || cmdRef[3].trim() == undefined) {
            return msg.reply("Empty space, so much empty space. Fill it with a division name next time.").then(sent => sent.delete(10000));
        }

        let divName = cmdRef[3].trim();
        let capDivName = convertToTitleCase(divName);
        let cats = await dbQuery.run(fishsticks, `SELECT * FROM fs_gr_Divisions`);
        let found = false;
        let divisionInfo;

        for (cat in cats) {
            if (cats[cat].name == capDivName) {
                found = true;
                divisionInfo = cats[cat];
                break;
            }
        }

        if (found) {
            //Generate report for division found
            let divRoles = await dbQuery.run(fishsticks, `SELECT * FROM fs_gr_Roles WHERE division = "${capDivName}"`);
            let roleList = "";
            let lastEntry = 1;

            syslog("Division role listing includes " + divRoles.length + " roles.", 2);

            for (roleItem in divRoles) {
                if (roleItem % 5 == 0 && roleItem != 0) {
                    roleList = roleList.concat(`- ${divRoles[roleItem].name} : ${divRoles[roleItem].game} (Members: ${divRoles[roleItem].numMembers})`);
                    postDivReport(roleList, lastEntry++, divisionInfo);
                    roleList = "";
                } else {
                    roleList = roleList.concat(`- ${divRoles[roleItem].name} : ${divRoles[roleItem].game} (Members: ${divRoles[roleItem].numMembers})`);
                }
            }

            postDivReport(roleList, lastEntry++, divisionInfo);
            roleList="";
            return;
        } else {
            return msg.reply("I couldn't find that division...huh. All neural net sectors look good...did you do a typo?").then(sent => sent.delete(10000));
        }
    }

    //Paging function for multiple roles per division
    function postDivReport(divList, lastIndex, divisionInfo) {
        syslog("Posting division list " + lastIndex);
        let divReportPanel = new Discord.RichEmbed();
            divReportPanel.setTitle(`o0o - Division Report: ${divisionInfo.name} [${lastIndex}]`);
            divReportPanel.setColor(config.fscolor);
            divReportPanel.setFooter("This menu will disappear in 30 seconds. Report was summoned by " + msg.author.username);

        if (lastIndex == 1) {
            divReportPanel.setDescription(`${divisionInfo.description}`);
            divReportPanel.addField("Role List", divList, false);
        } else {
            divReportPanel.setDescription("Role List, continued.");
            divReportPanel.addField("ROle List", divList, false);
        }

        msg.channel.send({embed: divReportPanel}).then(sent => sent.delete(30000));
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

//EXTERNAL FUNCTIONS

//Convert whole string into title case (This Is Title Case)
function convertToTitleCase(title) {
    title = title.toLowerCase();

    console.log("[Convert to Title] Title: " + title);
    
    let breakup = title.split('');
    let newTitle = [];
    let bumpNext = false;

    for (letter in breakup) {
        if (letter == 0) {
            newTitle.push(breakup[letter].toUpperCase());
        } else if (breakup[letter] == ' ') {
            newTitle.push(' ');
            bumpNext = true;
        } else {
            if (bumpNext) {
                newTitle.push(breakup[letter].toUpperCase());
                bumpNext = false;
            } else {
                newTitle.push(breakup[letter]);
            }
        }
    }

    let reprocessedTitle = newTitle.join('');
    console.log("[Convert to Title] Reprocessed: " + reprocessedTitle);
    return reprocessedTitle;
}