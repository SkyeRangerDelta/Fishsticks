//----PING STATS----
const Discord = require('discord.js');
const cfg = require('../../Modules/Core/corecfg.json');
const query = require('../../Modules/Functions/db/query.js');

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete();

    msg.reply("Have some text that doesn't explain why this command doesn't do what it's supposed to do. (Oh, and it's not even permanent.").then(sent => sent.delete(10000));

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
    let divRoleCount = 0;

    divCount = divList.length;

    //ROLES
    let roleCount = 0;
    let officialRoles = 0;
    let unofficialRoles = 0;

    roleCount = roleList.length;

    //COMPOUND
    let memberCount = 0;

    let divCompound = {
        
    }

    for (role in roleList) {
        for (div in divList) {
            if (roleList[role].division == divList[div].name) {
            }
        }
    }
}