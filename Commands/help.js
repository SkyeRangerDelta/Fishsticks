const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (fishsticks.engmode == false) {

        var help = new Discord.RichEmbed();
			help.setTitle("o0o - FISHSTICKS HELP - o0o")
			help.setColor(config.fscolor)
			help.setThumbnail("https://cdn.discordapp.com/attachments/125677594669481984/419996636370960385/fishdiscord.png")
			help.setDescription(
				"Hi there, looking for a command to use? See below:\n" + 
				"===============================================\n\n" +
				"**Normal Commands**\n" +
				"-----------------------------------------------\n" +
				"``!channels``: Displays description for all the channels!\n"+
				"``!divisions``: Lists the official CC Divisions and their leaders.\n"+
				"``!help``: Displays this menu.\n" +
				"``!info [commandID]``: Tutorial on the given commandID.\n"+
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
				"**Music Player Commands**\n"+
				"-----------------------------------------------\n" +
				"`!play [youtubeLink]`: If you meet the conditions (Member+, in a temporary channel), issuing this will attach fishsticks to your channel and play music.\n"+
				"`!stop`: If you are attached to the same channel as fishsticks, this halts playback.\n"+
				"`!skip`: Skips to the next song in the playlist queue.\n"+
				"`!queue`: Lists the songs in the playlist.\n"+
				"`!playing`: Shows the currently playing song.\n"+
				"`!volume <numValue>`: Shows the current volume of the music player. Assigning a value changes it (Can only be 1-5).\n\n"+
				"**CC Member Commands**\n"+
				"-----------------------------------------------\n" +
				"``!report [type] [target] [reason]``: report a problem to the necessary member.\n"+
				"``!tempch [max users <0 if none>] [name]``: Creates a temporary channel.  You must have the CC Members, Staff, or Bot to run. Join the Channel Spawner first before running the command.\n"+
				"``*!vouch [memberID]``: When 2 verified members of CC vouch for an newcomer, they will gain the Trusted role.*\n\n"+
				"**Administrative Commands**\n" +
				"-----------------------------------------------\n" +
				"``!echo [type] [time] [message]``: This command will take your message and broadcast it as an announcement after the specified time (in minutes) has passed.\n" +
				"``!engm``: Toggles Engineering Mode on or off depending on current state.\n\n"+
				"``This menu will delete itself in 45 seconds.``")
        
        msg.channel.send({embed: help}).then(sent => sent.delete(45000));
    }
    else {
        var helpeng = new Discord.RichEmbed();
		helpeng.setTitle("o0o - FISHSTICKS HELP (ENGM) - o0o")
		helpeng.setColor(config.fscolor)
		helpeng.setDescription(
			"Engineering mode enabled? Here are the commands you can still use:\n"+
			"===============================================\n\n" +
			"**Normal Commands**\n" +
			"-----------------------------------------------\n" +
			"``!channels``: Displays description for all the channels!\n"+
			"``!divisions``: Lists the official CC Divisions and their leaders.\n"+
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

        msg.channel.send({embed: helpeng}).then(sent => sent.delete(45000));
    }
}