const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    if (fishsticks.engmode == false) {

        var help1 = new Discord.MessageEmbed();
			help1.setTitle("o0o - FISHSTICKS HELP - o0o");
			help1.setColor(config.fscolor);
			help1.setDescription(
				"Hi there, looking for a command to use? See below:\n" + 
				"===============================================\n" +
				"`!account [create/delete] [username] [password] [confirmPassword]`: Creates a Fishsticks Online account." + 
				"`!bible <book num> [book] [chapter] [starting verse] [ending verse]`: Shows a selected range of verses! `*UNDER CONSTRUCTION*`\n"+
				"`!channels`: Displays description for all the channels!\n"+
				"`!codex [commandID]`: Displays a report of a command and it's syntax/parameters.\n"+
				"`!gif <value>`: Shows a random GIF! Specify a value to get some targeted results.\n"+
				"`!help`: Displays this menu.\n" +
				"`!info [commandID]`: Tutorial on the given commandID.\n"+
				"`!ips`: Displays Official CC Server IP addresses\n"+
				"`!links`: Provides a list of useful links.\n" +
				"`!roles`: Lists all the roles and their descriptions.\n" +
				"`!rules`: Shows the rules of the CC Discord server.\n" +
				"`!version`: Fishsticks version report.\n" +
				"`!status`: Displays current running information for Fishsticks."
			);
		
		var help2 = new Discord.MessageEmbed();
			help2.setTitle("o0o - DIVISION COMMANDS - o0o");
			help2.setColor(config.fscolor);
			help2.setDescription(
				"Use any of these commands to add or remove a divisional role yourself. These are used for announcements regaurding that divison.\n"+
				"`!creative`: Creative\n" +
				"`!role`: Allows use of game role/division based functions."
			);

		var help3 = new Discord.MessageEmbed();
			help3.setTitle("o0o - CC MEMBER COMMANDS - o0o");
			help3.setColor(config.fscolor);
			help3.setDescription(
				"`!musichelp`: Shows the list of music player commands\n"+
				"`!poll -[Poll Question] -[Answer 1] -[Answer 2] <-Answer 3>`: Note the hyphens separating the question, and the answers. Requires at least 2 answers. Up to 9 answers can be shown.\n"+
				"`!report [type] [target] [reason]`: report a problem to the necessary member.\n"+
				"`!tempch <maxUsers> [name]`: Creates a temporary channel.  You must have the CC Members, Staff, or Bot to run. Join the Channel Spawner first before running the command.\n"+
				"`!vouch [@user]`: Adds a vouch for a newcomer to become recognized. Each person requires at least two vouches to be granted Recognized."
			);
		
		var musichelp = new Discord.MessageEmbed();
			musichelp.setTitle("o0o - MUSIC PLAYER COMMANDS - o0o");
			musichelp.setColor(config.fscolor);
			musichelp.setDescription(
				"*Music player commands are temporarily disabled until further notice.*"
			);

		var help4 = new Discord.MessageEmbed();
			help4.setTitle("o0o - ADMINISTRATIVE COMMANDS - o0o");
			help4.setColor(config.fscolor);
			help4.setDescription(
				"`!echo [type] [time] [message]`: This command will take your message and broadcast it as an announcement after the specified time (in minutes) has passed.\n" +
				"`!subroutine [enable/disable] [subroutineName]`: Allows you to completely disable a subroutine of Fishsticks. Use with caution.\n"+
				"`!tempname [channelName]`: Renames the current temporary channel.\n"+
				"`!userinfo @user`: Generates a detailed report on a user."
			);
        
		msg.channel.send({embed: help1}).then(sent => sent.delete({timeout: 64000}));
		msg.channel.send({embed: help2}).then(sent => sent.delete({timeout: 63000}));
		msg.channel.send({embed: help3}).then(sent => sent.delete({timeout: 62000}));
		msg.channel.send({embed: musichelp}).then(sent => sent.delete({timeout: 61000}));
		msg.channel.send({embed: help4}).then(sent => sent.delete({timeout: 60000}));
    }
    else {
        var helpeng = new Discord.MessageEmbed();
		helpeng.setTitle("o0o - FISHSTICKS HELP (ENGM) - o0o")
		helpeng.setColor(config.fscolor)
		helpeng.setDescription(
			"Engineering mode enabled? Here are the commands you can still use:\n"+
			"**This menu may be outdated. See the updated help once ENGM is off.**\n"+
			"===============================================\n\n" +
			"**Normal Commands**\n" +
			"-----------------------------------------------\n" +
			"``!channels``: Displays description for all the channels!\n"+
			"``!divisions``: Lists the official CC Divisions and their leaders.\n"+
			"``!gif <value>``: Shows a random GIF! Specify a value to get some targeted results.\n"+
			"``!help``: Displays this menu.\n" +
			"``!ips``: Displays Official CC Server IP addresses\n"+
			"``!links``: Provides a list of useful links.\n" +
			"``!roles``: Lists all the roles and their descriptions.\n" +
			"``!rules``: Shows the rules of the CC Discord server.\n" +
			"``!version``: Fishsticks version report.\n" +
			"``!status``: Displays current running information for Fishsticks.\n\n" +
			"**Divisional Role Commands**\n"+
			"-----------------------------------------------\n" +
			"Use any of these commands to add the divisional role to yourself. These are used for announcements regaurding that divison.\n"+
			"`!ark`: Ark: Survival Evolved\n"+
			"`!overwatch`: Overwatch\n"+
			"`!pubg`: PLAYERUNKNOWN'S BATTLEGROUNDS\n"+
			"`!rocketleague`: Rocket League\n\n"+
			"**CC Member Commands**\n"+
			"-----------------------------------------------\n" +
			"``!report [type] [target] [reason]``: report a problem to the necessary member.\n"+
			"  --> ``!info report``: Details on how to use ``!report``.\n\n" +
			"**Administrative Commands**\n" +
			"-----------------------------------------------\n" +
			"``!engm``: Toggles Engineering Mode on or off depending on current state.\n\n"+
			"``This menu will delete itself in 45 seconds.``"
		)

        msg.channel.send({embed: helpeng}).then(sent => sent.delete({timeout: 45000}));
    }
}