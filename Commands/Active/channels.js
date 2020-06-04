const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    var channels = new Discord.MessageEmbed();
		channels.setTitle("o0o - CC DISCORD CHANNELS - o0o");
		channels.setColor(config.fscolor);
		channels.setDescription(
			"Wondering about all these channels off to the left? Here's a nifty list to explain it all!\n"+
			"==========================================================\n" +
			"**Key**:\n"+
			"🔇 : Meaning you should probably mute this channel.\n"+
			"🔒 : Meaning this channel requires certain permissions to make full use of.\n\n"
		);
		channels.addField("Server Channels",
			"**Rules**: Community Statement, Rules, and nifty links.\n"+
			"**Announcements**: Fairly self-explanitory.\n\n",
			false);
		channels.addField("Christian Crew Channels",
			"**Crash Pad**: 🔒 Newcomer landing zone. Stand back.\n"+
			"**Hangout**: The hangout channel! General chat.\n"+
			"**Lounge**: Lounge, another general chat.\n"+
			"**Memes**: Self-explanitory (I hope).\n"+
			"**Games**: Discussion channel for game-related stuff.\n"+
			"**Meeting Hall**: Used to discuss meeting topics during CC meetings.\n"+
			"**(V) Hangout**: Hangout voice channel.\n"+
			"**(V) Lounge**: Lounge voice channel.\n"+
			"**(V) Meeting Hall**: CC Meeting voice channel (might get loud).\n\n",
			false);
		channels.addField("Ministry",
			"**Discussion Den**: Serious discussion channel - for non-silly conversations. Keep it civil, behavior enforced." +
			"**Prayer Requests**: Post here with your concerns (or praises!).\n"+
			"**Bible Study**: Bible Study discussion chat channel.\n"+
			"**(V) Discussion Den**: Discussion Den voice channel." +
			"**(V) Bible Study**: Bible Study voice channel.\n"+
			"**(V) CC Book Study**: Book Study voice channel.\n"+
			"**(V) Power Prayer Tuesdays**: Power Prayer Tuesdays channel.\n\n",
			false);
		channels.addField("The Fish (Official CC Games)",
			"'Divisional' Game channels. If you are playing a game (alone or with others), please use the appropriate channel for your game or create a temporary channel.\n\n",
			false);
		channels.addField("Temp Channels",
			"*These channels are managed by Fishsticks. To create one, seek the `!tempch` command in `!help`.\n\n",
			false);
		channels.addField("Staff",
			"🔒 These channels are for Staff!\n\n",
			false);
		channels.addField("Misc",
			"**Art Gallery**: 🔒 Drawings and postings from our scribblenauts.\n"+
			"**Fishsticks Music Log**: 🔇 This is where Fishsticks will relay all of the music player output. (Including queues).\n"+
			"**Fishsticks Console**: 🔇 🔒 Danger zone. Fishsticks testing zone.\n"+
			"**Fishsticks System Log**: 🔇 🔒 Fishsticks' real time console output.\n"+
			"**Bot-Logger**: Bot Logger output.\n"+
			"**Conference Room**: 🔒 (A)CC Member and up only.\n"+
			"**(V) Conference Room**: 🔒 Conference Room voice channel.\n"+
			"**(V) Art Gallery**: 🔒 Art Gallery voice channel.\n"+
			"**AFK**: Avidly Frenetic Koalas.\n\n",
			false);

    msg.channel.send({embed: channels}).then(sent => sent.delete({timeout: 90000}));
}