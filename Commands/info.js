const Discord = require('discord.js');
const config = require('../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    if (cmd[0] == "report" || cmd[0] == "Report") {
        var infoReport = new Discord.RichEmbed();
		infoReport.setTitle("o0o - INFO CODEX - o0o")
		infoReport.setColor(config.fscolor)
		infoReport.setDescription(
			"Command ID:``!report [type] [target] [reason]``\n"+
			"Parameters:\n"+
			"	->`type`:\n"+
			"		-->`server`:\n" +
            "               Used in the event of server troubles. Alerts tech support.\n"+
            "               Valid Targets: `IP` or `Server Name`\n"+
            "       -->`conduct`:\n"+
            "               Used to report troublesome users (trolls). Alerts staff.\n"+
            "               Valid Targets: `member ID (mention/tag)`\n"+
            "       -->`discord`:\n"+
            "               Used to report Discord problems. Alerts tech support.\n"+
            "               Valid Targets: `role`, `username`, `invite`, or `channel`\n"+
            "   ->`target`: Dependent on type, see above.\n"+
            "   ->`reason`: Describe the problem with the most insight you can provide.\n"+
            "Description: `Submits a ticket to leadership concerning a problem with various parts of CC.`\n\n"+
            "``This message will delete itself in 30 seconds.``"
        )
        
        msg.channel.send({embed: infoReport}).then(sent => sent.delete(30000));
    }
    else if (cmd[0] == "tempch" || cmd[0] == "Tempch") {
        var infoTempCh = new Discord.RichEmbed();
		infoReport.setTitle("o0o - INFO CODEX - o0o")
		infoReport.setColor(config.fscolor)
		infoReport.setDescription(
			"Command ID:``!tempch <maxUsers> [channelName]``\n"+
			"Parameters:\n"+
			"	->`maxUsers`:\n"+
			"		-->The maximum number of users that can connect to the channel. Can be ignored (see below).\n" +
            "   ->`channelName`:\n"+
            "       -->Required, the name of the channel you are creating.\n"+
            "   Note: If you are making a channel that has more than one (1) word in it's name, you need to add a number for `maxUsers`. If you don't, you'll lose the first word of  your channel name. (0 and 1 are safe numbers to use)\n"+
            "Description: `Creates a new temporary voice channel. Has a customizable parameter for maximum users. Temporary channels will auto-delete themselves when everyone leaves.`\n\n"+
            "``This message will delete itself in 30 seconds.``"
        )
        
        msg.channel.send({embed: infoTempCh}).then(sent => sent.delete(30000));
    }
    else if (cmd[0] == "engm" || cmd[0] == "ENGM") {
        var infoengm = new Discord.RichEmbed();
		infoengm.setTitle("o0o - INFO CODEX - o0o")
		infoengm.setColor(config.fscolor)
		infoengm.setDescription(
			"Command ID:``!engm``\n"+
            "Parameters: `none`\n"+
            "Description: `Toggles Fishsticks between active or inactive Engineering Mode. Used by staff/bot developers for when work is being done on Fishsticks' code. It disables commands such as tempch and echo because of the possibility of an code failure or command termination on restart.`\n\n"+
            "``This message will delete itself in 30 seconds.``"
        )
        
        msg.channel.send({embed: infoengm}).then(sent => sent.delete(30000));
    }
    else  if (cmd[0] == "info" || cmd[0] == "Info") {
        var infoinfo = new Discord.RichEmbed();
		infoinfo.setTitle("o0o - INFO CODEX - o0o")
		infoinfo.setColor(config.fscolor)
		infoinfo.setDescription(
			"Command ID:``!info [commandID]``\n"+
            "Parameters:\n"+
            "   ->`commandID`: the part of a command that comes after the `!`.\n"+
            "Description: `Describes a command. Like this!`\n\n"+
            "``This message will delete itself in 30 seconds.``"
        )
        
        msg.channel.send({embed: infoinfo}).then(sent => sent.delete(30000));
    }
    else if (cmd[0] == "echo" || cmd[0] == "Echo") {
        var infoecho = new Discord.RichEmbed();
            infoecho.setTitle("o0o - INFO CODEX - o0o");
            infoecho.setColor(config.fscolor);
            infoecho.setDescription(
                "Command ID: `!echo [type] [time] [message]`\n"+
                "Parameters:\n"+
                    "   ->`type`: Used to define divisional announcement or not. Recognized types are as follows:\n"+
                    "       `rl`: Rocket League\n"+
                    "       `pubg`: PUBG\n"+
                    "       `ark`: Ark: SE\n"+
                    "       `ow`: Overwatch\n"+
                    "       `all` or `none`: General announcement, non-divisional.\n"+
                    "   ->`time`: Specify the time in minutes to wait before announcing.\n"+
                    "   ->`message`: The message to be announced, do not include mentions such as `@here` because that'll be repetetive.\n"+
                "Description: `Delayed announcing, useful for events and server messages. Wait time can be 0. Types allow for divisional tagging. All parameters required.`\n\n"+
                "`This message will delete itself in 30 seconds`"
            );

        msg.channel.send({embed: infoplay}).then(sent => sent.delete(30000));
    }
    else if (cmd[0] == "play" || cmd[0] == "Play") {
        var infoplay = new Discord.RichEmbed();
            infoplay.setTitle("o0o - INFO CODEX - o0o");
            infoplay.setColor(config.fscolor);
            infoplay.setDescription(
                "Command ID: `!play [youtubeURL]`\n"+
                "Parameters:\n"+
                "   ->`youtubeURL`: This is the YouTube link that the bot will pull the music from.\n"+
                "Description: `Utilizes the bot's music player function via a youtube video link.`\n\n"+
                "`This message will delete itself in 30 seconds`"
            );

        msg.channel.send({embed: infoplay}).then(sent => sent.delete(30000));
    }
}