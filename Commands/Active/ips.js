const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    var ips = new Discord.MessageEmbed();
		ips.setTitle("o0o - CC 'THE FISH' SERVERS - o0o")
		ips.setColor(config.fscolor)
		ips.setDescription(
			`CCG recognized servers and their IPS.`
		);
		ips.addField(`CCG Official Servers`, "ARK: Survival Evolved (Admin: Nils Sargon): `192.99.126.106:41213`\n" +
		"Terraria (Admin: Winged Scribe): `pldyn.net:41213`\n" +
		"Minecraft (Admin: FutronBob): `Pending Addition`");

    msg.channel.send({embed: ips}).then(sent => sent.delete({timeout: 30000}));
}