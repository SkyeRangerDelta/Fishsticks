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
            "       -->`tech`:\n"+
            "               Used to report Discord problems. Alerts tech support.\n"+
            "               Valid Targets: `role`, `username`, `invite`, or `channel`\n"+
            "   ->`target`: Dependent on type, see above.\n"+
            "   ->`reason`: Describe the problem with the most insight you can provide.\n\n"+
            "``This message will delete itself in 30 seconds.``"
        )
        
        msg.channel.send({embed: infoReport}).then(sent => sent.delete(30000));
    }
}