const Discord = require('discord.js');
const config = require('../../Modules/Core/Core_config.json');

module.exports = {
	run,
	help
};

function run(fishsticks, cmd) {
    msg.delete({timeout: 0});

    var links = new Discord.MessageEmbed();
			links.setTitle("o0o - CC GAMING LINKS - o0o")
			links.setColor(config.fscolor)
			links.setDescription(
				"[CC Gaming Website](https://www.ccgaming.com)\n" +
				"[CCG Discord Invite Link](https://discord.ccgaming.com)\n"+
				"[Official CCTV Twitch Stream](https://twitch.tv/christiancrewtv)\n" +
				"[Official CC YouTube Channel](https://www.youtube.com/user/ChristianCrewGaming)\n\n"+
				"[Skye's Definitive Guide to Discord - Forums](https://forums.ccgaming.com/viewtopic.php?f=2&t=24357)\n\n"+
				"[LCARS Database: Fishsticks](https://wiki.pldyn.net/en/fishsticks)\n"+
				"[LCARS Database: Guide to Fishsticks](https://wiki.pldyn.net/en/fishsticks/general-guide)\n\n"+
				"``This message will delete itself in 30 seconds.``")

    msg.channel.send({embed: links}).then(sent => sent.delete({timeout: 30000}));
}

function help() {
	return 'Lists useful CC links.';
}