const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var ips = new Discord.RichEmbed();
		ips.setTitle("o0o - CC 'THE FISH' SERVERS - o0o")
		ips.setColor(config.fscolor)
		ips.setDescription(
			"**ARK: SURVIVAL EVOLVED**\n" +
            "Crystal Isles: `192.99.83.148:7060`\n"+
            "Extinction: `192.99.83.148:7370`"
		);

    msg.channel.send({embed: ips}).then(sent => sent.delete(30000));
}