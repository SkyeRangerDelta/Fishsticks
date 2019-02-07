const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var ips = new Discord.RichEmbed();
		ips.setTitle("o0o - CC 'THE FISH' SERVERS - o0o")
		ips.setColor(config.fscolor)
		ips.setDescription(
			"CC currently doesn't host any game servers.\n\nPersnaps you could send SkyeRangerDelta a message?"
		);

    msg.channel.send({embed: ips}).then(sent => sent.delete(30000));
}