// ---- Embed Builder ----

//Imports
const { EmbedBuilder } = require('discord.js');
const config = require('../../Modules/Core/Core_config.json');

//Exports
module.exports = {
	embedBuilder,
	quickEmbed
};

function embedBuilder(embed) {
	const constructedEmbed = new EmbedBuilder();

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
		constructedEmbed.setFooter({ text: embed.footer });
	}
	else {
		constructedEmbed.setFooter({ text: embed.footer });
	}

	if (embed.thumbnail === undefined && (embed.noThumbnail === false || embed.noThumbnail === undefined)) {
		constructedEmbed.setThumbnail('https://pldyn.net/wp-content/uploads/2020/01/LogoAnimated02.gif');
	}
	else if (!embed.noThumbnail) {
		constructedEmbed.setThumbnail(embed.thumbnail);
	}

	//Set fields
	if (embed.fields) {
		constructedEmbed.addFields(embed.fields);
	}

	return constructedEmbed;
}

function quickEmbed(data) {
	const qe = new EmbedBuilder();
	qe.setTitle(data.title);
	qe.setDescription(data.description);
	qe.setColor(config.colors.primary);

	return qe;
}