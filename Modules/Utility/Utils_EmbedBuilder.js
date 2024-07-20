// ---- Embed Builder ----

//Imports
const { EmbedBuilder } = require( 'discord.js' );
const { randomFooter } = require( '../Utility/Utils_MessageGenerators' );
const config = require( '../Core/Core_config.json' );

//Exports
module.exports = {
	embedBuilder,
	quickEmbed
};

function embedBuilder( embed ) {
	if ( !embed.title || !embed.description ) throw 'Invalid embed object!';
	const data = {
		title: embed.title,
		description: embed.description,
		color: embed.color ? embed.color : config.colors.primary,
		footer: embed.footer ? embed.footer : { text: `${randomFooter()}` },
		thumbnail: embed.noThumbnail ? 'https://cdn.pldyn.net/i/9d6hlxzrhz.png' : embed.thumbnail
	};

	const embedObject = new EmbedBuilder()
		.setTitle( data.title )
		.setDescription( data.description )
		.setColor( data.color )
		.setFooter( data.footer )
		.setThumbnail( data.thumbnail );

	if ( embed.fields ) {
		embedObject.setFields( embed.fields );
	}

	return embedObject;
}

function quickEmbed( data ) {
	const qe = new EmbedBuilder();
	qe.setTitle( data.title );
	qe.setDescription( data.description );
	qe.setColor( config.colors.primary );

	return qe;
}