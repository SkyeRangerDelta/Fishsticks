// ---- Embed Builder ----

//Imports
const Discord = require('discord.js');
const config = require('../../Modules/Core/Core_config.json');

//Exports
module.exports = {
	embedBuilder
};

function embedBuilder(embed) {
	const constructedEmbed = new Discord.MessageEmbed();

	constructedEmbed.setTitle(embed.title);
	constructedEmbed.setDescription(embed.description);

	if (!embed.title || !embed.description) {
		throw 'No title and/or no description for Embed Builder!';
	}

	if (!embed.color) {
		constructedEmbed.setColor(config.colors.primary);
	}
	else {
		constructedEmbed.setColor(embed.color);
	}

	if (embed.delete === undefined) {
		constructedEmbed.setFooter(embed.footer);
	}
	else {
		constructedEmbed.setFooter(embed.footer + ` Panel will auto-delete in ${embed.delete / 1000} seconds.`);
	}

	if (embed.thumbnail === undefined && (embed.noThumbnail === false || embed.noThumbnail === undefined)) {
		constructedEmbed.setThumbnail('https://pldyn.net/wp-content/uploads/2020/01/LogoAnimated02.gif');
	}
	else if (!embed.noThumbnail) {
		constructedEmbed.setThumbnail(embed.thumbnail);
	}

	//Set fields
	const embedFields = [];
	if (embed.fields) {
		constructedEmbed.setFields(embedFields);
	}

	for (const field in embed.fields) {
		embedFields.push(embed.fields[field]);
	}

	return constructedEmbed;
}