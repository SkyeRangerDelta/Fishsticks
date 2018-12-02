const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var divisions = new Discord.RichEmbed();
		divisions.setTitle("o0o - CC OFFICIAL DIVISIONS - o0o");
		divisions.setColor(config.fscolor);
		divisions.setDescription(
			"The official CC Divions are as follows:\n"+
			"---------------------------------------\n"+
			"**Ark: Survival Evolved**: DL: Grizz Galant/Dagradon\n"+
			"**Creative**: 'DL': NeoJ/Kesarahk\n"+
			"**Overwatch**: DL: Dodge\n"+
			"**PUBG**: DL: Rocket Chair\n\n"+
			"``Message will delete itself in 30 seconds``"
		);

    msg.channel.send({embed: divisions}).then(sent => sent.delete(90000));
}