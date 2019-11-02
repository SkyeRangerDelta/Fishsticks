//----PING STATS----
const Discord = require('discord.js');
const cfg = require('../../Modules/Core/corecfg.json');
const query = require('../../Modules/Functions/db/query.js');
const syslog = require('../../Modules/Functions/syslog.js');

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete();

    msg.reply("Hold tight while I crunch them tasty numbers.").then(sent => sent.delete(10000));

    function log(message, level) {
        syslog.run(fishsticks, "[GR-STATS] " + message, level);
    }

    let statsReportPanel = new Discord.RichEmbed();
        statsReportPanel.setColor(cfg.fscolor);
        statsReportPanel.setTitle("o0o - Gameroles Subroutine Report - o0o");
        statsReportPanel.setDescription("The game roles subroutine (Logged as [GAME-ROLES]) is a *very* large subsystem, currently the largest subroutine that runs" +
            " in Fishsticks. The following information is a comprehensive report of all roles and divisions associated with the routine.\n\nNote that 'role' and 'divisions' in" +
            " this context are only in reference to the user created roles and their subsequent divisions. Actual server roles are not associated with this routine.");
        statsReportPanel.setFooter("This menu will disappear in 1 minute. Menu was summoned by " + msg.author.username);

    //Gather information
    let roleList = await query.run(fishsticks, `SELECT * FROM fs_gr_Roles`);
    let divList = await query.run(fishsticks, `SELECT * FROM fs_gr_Divisions`);

    //DIVISIONS
    let divCount = 0;

    divCount = divList.length;

    //ROLES
    let roleCount = 0;
    let officialRoles = 0;
    let unofficialRoles = 0;

    roleCount = roleList.length;

    //COMPOUND
    let fluxDate = 0; //Date in MS
    let memberCount = 0;
    let latestPingRole = "";
    let latestPingDate = "";

    //Init Compound Div - COunt roles per Division
    let divCompound = new Map();

    log("Initializing divisions compound", 2);
    for (divItem in divList) {
        divCompound.set(divList[divItem].name, 0);
    }
    log("Divisions compound done!", 2);
    
    //Init Compound Roles - Count pings per Role
    let roleCompound = new Map();

    log("Initializing roles compound", 2);
    for (roleItem in roleList) {

        let roleObj = {
            name: roleList[roleItem].name,
            pings: roleList[roleItem].pings,
            lastPing: roleList[roleItem].lastPing
        };

        roleCompound.set(roleList[roleItem].name, roleObj);
    }
    log("Role compound done!", 2);

    //Build counts
    log("Beginning counts...", 3);
    for (role in roleList) {

        //Count number of (un)official roles
        if (roleList[role].official == 1) {
            officialRoles++;
        } else {
            unofficialRoles++;
        }

        //Increment members
        memberCount += roleList[role].numMembers;

        //Calculate latest pings - of ALL roles
        let reinterpretDate = roleList[role].lastPing;
        reinterpretDate = reinterpretDate.replace('/', ' ');
        reinterpretDate = reinterpretDate.replace('AM', '');
        reinterpretDate = reinterpretDate.replace('PM', '');

        if (fluxDate < Date.parse(reinterpretDate)) {
            fluxDate = Date.parse(reinterpretDate);
            latestPingDate = roleList[role].lastPing;
            latestPingRole = roleList[role].name;
        }

        //Count roles for each division
        for (div in divList) {
            if (roleList[role].division == divList[div].name) {
                divCompound.set(divList[div].name, )
            }
        }
    }
    log("Counts done!", 3);

    statsReportPanel.addField("General Stats",
        "Number of Divisions: `" + divCount + "`\n"+
        "Number of Roles: `" + roleCount + "`\n"+
        "   Unofficial Roles: `" + unofficialRoles + "`\n"+
        "   Official Roles: `" + officialRoles + "`\n"+
        "Most recent role pinged: `" + latestPingRole + "`\n"+
        "Most recent role ping date: `" + latestPingDate + "`\n"+
        "Member Count: `" + memberCount + "`");

    msg.channel.send("Crunch done!").then(sent => sent.delete(5000));
    msg.channel.send({embed: statsReportPanel}).then(sent => sent.delete(60000));

    //Prep Roles info
    let rolePanelList = ""
    let lastIndex = 0;

    for (roleEntry in roleCompound) {
        if (roleEntry % 5 == 0 && roleEntry != 0) {
            rolePanelList = rolePanelList.concat(`- **${roleCompound[roleEntry].name}** (${roleCompound[roleEntry].pings}): ${roleCompound[roleEntry].lastPing}`);
            postPanelReport(rolePanelList);
            rolePanelList = "";
        }
    }
}