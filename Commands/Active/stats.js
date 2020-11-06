//----PING STATS----
const Discord = require('discord.js');
const cfg = require('../../Modules/Core/Core_config.json');
const query = require('../../Modules/Functions/db/query.js');
const syslog = require('../../Modules/Functions/syslog.js');

module.exports = {
    run,
    help
};

async function run(fishsticks, cmd) {
    msg.delete({timeout: 0});

    msg.reply("Hold tight while I crunch them tasty numbers.").then(sent => sent.delete({timeout: 10000}));

    function log(message, level) {
        syslog.run(fishsticks, "[GR-STATS] " + message, level);
    }

    let statsReportPanel = new Discord.MessageEmbed();
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

    //Init Compound Div - Count roles per Division
    let divCompound = [];

    log("Initializing divisions compound", 2);
    for (divItem in divList) {

        let divObj = {
            name: divList[divItem].name,
            roles: 0
        }

        divCompound.push(divObj);

        log(`Generated division object ${divItem} of ${divList.length}`, 2);
    }
    log("Divisions compound done!", 2);
    
    //Init Compound Roles - Count pings per Role
    let roleCompound = [];

    log("Initializing roles compound", 2);
    for (roleItem in roleList) {

        let roleObj = {
            name: roleList[roleItem].name,
            division: roleList[roleItem].division,
            pings: roleList[roleItem].pings,
            lastPing: roleList[roleItem].lastPing
        };

        roleCompound.push(roleObj);

        log(`Generated role object ${roleItem} of ${roleList.length}`, 2);
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
        for (rol in roleCompound) {
            for (div in divCompound) {
                log(`Comparing ${roleCompound[rol].division} to ${divCompound[div].name}`, 1);
                if (roleCompound[rol].division == divCompound[div].name) {
                    log("Matched! Associating role.", 1)
                    divCompound[div].roles = divCompound[div].roles + 1;
                }
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

    msg.channel.send("Crunch done!").then(sent => sent.delete({timeout: 5000}));
    msg.channel.send({embed: statsReportPanel}).then(sent => sent.delete({timeout: 60000}));

    //Prep Roles Info
    let rolePanelList = ""
    let lastIndex = 0;

    for (roleEntry in roleCompound) {
        if (roleEntry % 5 == 0 && roleEntry != 0) {
            rolePanelList = rolePanelList.concat(`- **${roleCompound[roleEntry].name}** (${roleCompound[roleEntry].pings}): ${roleCompound[roleEntry].lastPing}\n`);
            postPanelReport(rolePanelList, lastIndex++);
            rolePanelList = "";
        } else {
            rolePanelList = rolePanelList.concat(`- **${roleCompound[roleEntry].name}** (${roleCompound[roleEntry].pings}): ${roleCompound[roleEntry].lastPing}\n`);
        }
    }

    postPanelReport(rolePanelList, lastIndex++);
    rolePanelList = "";

    function postPanelReport(theList, page) {
        if (page == 1) {
            let roleListPanel = new Discord.MessageEmbed();
                roleListPanel.setTitle(`o0o - Game Roles Subroutine Report [Roles Page ${page}] - o0o`);
                roleListPanel.setColor(cfg.fscolor);
                roleListPanel.setFooter(`List will delete itself in 30 seconds. List was summoned by ${msg.author.username}`);
                roleListPanel.setDescription(`Each game role presented here is represented from an acitivity perspective. Each role lists it's pings and last known ping.`);
                roleListPanel.addField(`Ping Stats`, theList);
            
            msg.channel.send({embed: roleListPanel}).then(sent => sent.delete({timeout: 30000}));
        } else {
            let roleListPanel = new Discord.MessageEmbed();
                roleListPanel.setTitle(`o0o - Game Roles Subroutine Report [Roles Page ${page}] - o0o`);
                roleListPanel.setColor(cfg.fscolor);
                roleListPanel.setFooter(`List will delete itself in 30 seconds. List was summoned by ${msg.author.username}`);
                roleListPanel.setDescription(`Game role stats, continued.`);
                roleListPanel.addField(`Ping Stats`, theList);
            
            msg.channel.send({embed: roleListPanel}).then(sent => sent.delete({timeout: 30000}));
        }
    }

    //Prep Divisions Info
    let divPanelList = ""
    let lastDivIndex = 0;

    for (divEntry in divCompound) {
        if (divEntry % 5 == 0 && divEntry != 0) {
            divPanelList = divPanelList.concat(`- **${divCompound[divEntry].name}**: ${divCompound[divEntry].roles}\n`);
            postDivPanelReport(divPanelList, lastDivIndex++);
            divPanelList = "";
        } else {
            divPanelList = divPanelList.concat(`- **${divCompound[divEntry].name}**: ${divCompound[divEntry].roles}\n`);
        }
    }

    postDivPanelReport(divPanelList, lastDivIndex++);
    divPanelList = "";
    return;

    function postDivPanelReport(theDivList, altPage) {
        if (altPage == 1) {
            let divListPanel = new Discord.MessageEmbed();
                divListPanel.setTitle(`o0o - Game Roles Subroutine Report [Divisions Page ${altPage}] - o0o`);
                divListPanel.setColor(cfg.fscolor);
                divListPanel.setFooter(`List will delete itself in 30 seconds. List was summoned by ${msg.author.username}`);
                divListPanel.setDescription(`Each game role division is shown here with the number of roles associated with it.`);
                divListPanel.addField(`Division Stats`, theDivList);
            
            msg.channel.send({embed: divListPanel}).then(sent => sent.delete({timeout: 30000}));
        } else {
            let divListPanel = new Discord.MessageEmbed();
                divListPanel.setTitle(`o0o - Game Role Subroutine Report [Divisions Page ${altPage}] - o0o`);
                divListPanel.setColor(cfg.fscolor);
                divListPanel.setFooter(`List will delete itself in 30 seconds. List was summoned by ${msg.author.username}`);
                divListPanel.setDescription(`Game role stats, continued.`);
                divListPanel.addField(`Division Stats`, theDivList);
            
            msg.channel.send({embed: divListPanel}).then(sent => sent.delete({timeout: 30000}));
        }
    }
}

function help() {
    return 'Prints an exhaustive list of game roles statistics.';
}