//------GAME ROLE SUBROUTINE-------
//=================================

const Discord = require("discord.js");
const colors = require('colors');
const fs = require('fs');

const sysLogFunc = require('../../Modules/Functions/syslog.js');
const config = require('../../Modules/Core/corecfg.json');
const cpf = require('../../Modules/Functions/cpf.js');

let categories = require('../../Modules/GameRoles/categories.json');

let rolesJSON = JSON.parse(fs.readFileSync("./Modules/GameRoles/gameRoles.json", 'utf8'));

exports.run = (fishsticks, msg, cmd) => {

    msg.delete();

    if (!msg.member.roles.find("name", "Recognized")) {
        return msg.reply("You need to be at least Recognized in order to use this!").then(sent => sent.delete(10000));
    }

    //System logger
    function syslog(message, level) {
        console.log(colors.yellow("[GAME-ROLES] " + message));
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
        roleName = cmdRef[2].trim();
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

    function voteRole() {
        syslog("Attempting role vote...", 2);
        syslog("Vote Information:\n\tUser: " + msg.author.username + "\n\tRole Game/Name: " + roleName);

        let roleOfficialized = false;
        let roleFound = false;

        if (roleName == null || roleName == undefined) {
            return msg.reply("You have to specify what role you're voting for!");
        }

        for (role in rolesJSON.roles) {
            if (roleName == rolesJSON.roles[role].name) {
                roleFound = true;

                for (member in rolesJSON.roles[role].members) {
                    if (msg.author.id == rolesJSON.roles[role].members[member]) {
                        return msg.reply("Oi, come off it mate - you've already voted!");
                    }
                }

                rolesJSON.roles[role].votes++;
                rolesJSON.roles[role].members.push(msg.author.id);
                if (rolesJSON.roles[role].votes == 5) {
                    roleOfficialized = true;
                    rolesJSON.roles[role].official = true;
                }
                else if (rolesJSON.roles[role].votes > 5) {
                    return msg.reply("This role is already official!");
                }
            }
            else if (roleName == rolesJSON.roles[role].game) {
                roleFound = true;

                for (member in rolesJSON.roles[role].members) {
                    if (msg.author.id == rolesJSON.roles[role].members[member]) {
                        return msg.reply("Oi, come off it mate - you've already voted!");
                    }
                }

                rolesJSON.roles[role].votes++;
                rolesJSON.roles[role].members.push(msg.author.id);
                if (rolesJSON.roles[role].votes == 5) {
                    roleOfficialized = true;
                    rolesJSON.roles[role].official = true;
                }
                else if (rolesJSON.roles[role].votes > 5) {
                    return msg.reply("This role is already official!");
                }
            }
        }

        fs.writeFileSync("./Modules/GameRoles/gameRoles.json", JSON.stringify(rolesJSON));

        if (roleFound) {
            if (roleOfficialized) {
                msg.reply("You voted for " + roleName + ", it has reached 5 votes! Officializing!");
                officialize();
            }
            else {
                msg.reply("You have voted for " + roleName);
            }
        }
        else {
            msg.reply("That's not a role, did you type it wrong?")
        }
    }

    function createRole() {
        syslog("Attempting role creation...", 2);

        let divisionStruct;
        let roleDescription;

        if (cmdRef[3] != null || cmdRef[3] != undefined) {
            relatedGame = cmdRef[3].trim().toLowerCase();
        }
        else {
            return msg.reply("You must specify what game this role is related to! `[PARAM 3]`");
        }

        if (cmdRef[4] != null || cmdRef[4] != undefined) {
            divisionStruct = compareCats();

            if (divisionStruct == -1) {
                return msg.reply("You need to specify a proper genre to list the role in! Check !role -list -divisions").then(sent => sent.delete(15000));
            }
        }
        else {
            return msg.reply("You must specify what division/genre this role is related to! `[PARAM 4]`");
        }

        if (cmdRef[5] != null || cmdRef[5] != undefined) {
            roleDescription = cmdRef[5].trim();
        }
        else {
            return msg.reply("You must specify the role description! `[PARAM 5]`");
        }

        let dateObj = new Date();
        let date = dateObj.getMonth() + "/" + dateObj.getDate() + "/" + dateObj.getFullYear() + " @ ";
        let hour = dateObj.getHours();
        let minute = dateObj.getMinutes();
        let meridian = "AM";
        
        if (hour > 12) {
            hour = dateObj.getHours() - 12;
            meridian = "PM";
        }

        if (minute < 10) {
            minute = "0" + minute;
        }

        time = hour + ":" + minute + meridian;

        let currDate = date + time;

        let roleObject = {
            "name": roleName,
            "game": relatedGame,
            "division": divisionStruct,
            "description": roleDescription,
            "official": false,
            "votes": 1,
            "pings": 0,
            "lastPing": currDate,
            "members": [msg.author.id]
        }

        console.log(roleObject);

        rolesJSON.roles.push(roleObject);

        msg.reply("Role creation successful. You have been added to the members list and vote added.").then(sent => sent.delete(15000));

        fs.writeFileSync("./Modules/GameRoles/gameRoles.json" ,JSON.stringify(rolesJSON));

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

        console.log("[GAME-ROLE] Beginning role assignments.");

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

    }

    function capitalizeWord(word) {
        return word.charAt(0).toUpperCase() + word.substring(1, word.length);
    }

    function compareCats() {
        let cats = categories.cats;

        for (cat in cats) {
            if (cmdRef[4].toLowerCase().trim() == cats[cat].name.toLowerCase()) {
                return capitalizeWord(cmdRef[4].trim());
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
        return `https://cf.pldyn.net/wp-content/uploads/2019/03/${div}.png`;
    }



}