// ---- Embed Builder ----

//Imports
const Discord = require('discord.js');

//Exports
module.exports = {
	embedBuilder
};

function embedBuilder(embed) {
	const constructedEmbed = new Discord.MessageEmbed();

	constructedEmbed.setTitle(embed.title);
	constructedEmbed.setColor(embed.color);
	constructedEmbed.setDescription(embed.description);

	if (embed.delete == undefined) {
		constructedEmbed.setFooter(embed.footer);
	}
	else {
		constructedEmbed.setFooter(embed.footer + ` Panel will auto-delete in ${embed.delete / 1000} seconds.`);
	}

	if (embed.thumbnail == undefined) {
		constructedEmbed.setThumbnail('https://pldyn.net/wp-content/uploads/2020/01/LogoAnimated02.gif');
	}
	else {
		constructedEmbed.setThumbnail(embed.thumbnail);
	}

	for (const field in embed.fields) {
		constructedEmbed.addField(embed.fields[field].title, embed.fields[field].description, embed.fields[field].inline);
	}

	return constructedEmbed;
}