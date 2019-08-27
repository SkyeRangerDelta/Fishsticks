const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const sysLogFunc = require('../../Modules/Functions/syslog.js');

const dbQuery = require('../../Modules/Functions/db/query.js');

exports.run = async (fishsticks, msg, cmd) => {
	msg.delete();
	
	//System logger
	function syslog(message, level) {
		sysLogFunc.run(fishsticks, "[GAME-ROLES] " + message, level);
	}

	if (cmd[0] == "divisions") { //If thrown, print list of recognized divisions instead.

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

	if (cmd[0] == "cc") {
		let ccRolesPanel = new Discord.RichEmbed();
			ccRolesPanel.setTitle("o0o - CCG Roles Listing - o0o");
			ccRolesPanel.setColor(config.fscolor);
			ccRolesPanel.setFooter(`List summoned by ${msg.author.username}. List will auto-delete in 30 seconds.`);
			ccRolesPanel.setDescription(
				"*List is ordered from lowest Discord priority to highest.*\n\n" + 
				"**`@everyone`**: Someone with no roles assigned to them. These users are not considered part of the community yet.\n"+
				"**Logger**: The logger bot's role. Does stuff. Like watches you.\n" +
				"**Applied**: These users have applied for (A)CC Membership!\n" +
				"**Recognized**: These users are acknowledged to be trustworthy people allowed to wonder around in here.\n"+
				"**(A)CC Member**: (Associate) Christian Crew Member - an official member! Has access to increased Fishsticks functions.\n" +
				"**Moderator**: Someone who moderates!\n" +
				"**Bot**: Default bot role (plus SkyeRanger).\n" +
				"**The Nod**: Permits Twitch links in the chat.\n" +
				"**Debater**: Permissions role allowing chat permissions in the Discussion Den.\n" +
				"**Council Advisor**: Advises the Council on matters. (*This is **not** a Council Member*)\n" +
				"**Event Coordinator**: Coordinates events!\n" +
				"**Staff**: Generic permissions role.\n" +
				"**Tech Support**: These are tech support people. They run stuff.\n" +
				"**Council Member**: These are members of our all powerful Council that govern this land."
			);

			return msg.channel.send({embed: ccRolesPanel}).then(sent => sent.delete(30000));
	}

	syslog("Attempting role list...", 2);

	let roles = await dbQuery.run(fishsticks, `SELECT * FROM fs_gr_Roles;`);
	let oRoleCount = 0;
	let uRoleCount = 0;

	for (role in roles) {
		if (roles[role].official == 1) {
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
}