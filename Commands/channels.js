const Discord = require('discord.js');
const embed = require('./embeds/channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var channels = new Discord.RichEmbed();
		channels.setTitle("o0o - CC DISCORD CHANNELS - o0o")
		channels.setColor(fscolor)
		channels.setDescription(
			"Wondering about all these channels off to the left? Here's a nifty list to explain it all!\n"+
			"===============================================\n"+
			"**__Server Channels__**\n"+
			"**Rules**: Lists all the rules, can also be found using ``!rules``.\n"+
			"**Annnouncements**: Read this for important news and events information!\n\n"+
			"**__CC Channels__**\n"+
			"**Hangout**: The hangout channel!\n"+
			"**Lounge**: The sub-Hangout channel!\n"+
			"**Memes**: Self-explanitory.\n"+
			"**Prayer Requests 🔒**: Post here with concerns you'd like support with.\n"+
			"**Bible Study**: Biblestudy chat should be kept here.\n"+
			"**Meeting Hall**: During CC Meetings, use this channel for meeting topics.\n"+
			"**(V) Hangout**: Vocal hangout channel!\n"+
			"**(V) The Lounge**: Vocal sub-Hangout channel!\n"+
			"**(V) Safe Haven (Not-Hangout) 🔒**: Not the hangout channel. Quiet zone, hide from trolls.\n"+
			"**(V) Bible Study**: Voice channel for Bible Study.\n"+
			"**(V) CC Book Study**: Voice channel for the book study.\n"+
			"**(V) Meeting Hall**: Voice channel for CC Meetings every other week.\n"+
			"**(V) Power Prayer Tuesdays**: PPT Voice channel.\n"+
			"**(V) Kareoke**: Like to sing? Keep it down here.\n\n"+
			"**__The Fish (Offical Games)__**\n"+
			"**Games**: General games topic channel.\n"+
			"**(V) Overwatch**: General Overwatch voice channel.\n"+
			"**(V) Rocket League**: General RL voice channel. \n"+
			"**(V) RL Team 1**: Alt RL voice channel. \n"+
			"**(V) RL Competitive**: Max 4 people, team for competitive matchmaking.\n"+
			"**(V) Ark: Survival Evolved**: General voice channel for ARK.\n"+
			"**(V) PUBG**: General PUBG voice channel.\n"+
			"**(V) PUBG Team 1**: Alt PUBG voice channel\n"+
			"**(V) PUBG Solo**: It's quiet in here, unless you find teammates!\n\n"+
			"**__Staff 🔒__**\n"+
			"*The stuff under this category is for staff!*\n\n"+
			"**__Temp Channels__**\n"+
			"*Channels created here are managed by Fishsticks or manually by staff. They are meant to be temporary and can serve any purpose*.\n\n"+
			"**__Misc__**\n"+
			"**Off Topic**: Yea, it's down here.\n"+
			"**Fishsticks Console 🔒**: Skye's Fishsticks engineering deck. It might be dangerous!\n"+
			"**AFK**: Aversion to Flying Kangaroos.\n\n"+
			"``This message will delete itself in a minute and a half.``"
		)

    msg.channel.send({embed: embed}).then(sent => sent.delete(60000));
}