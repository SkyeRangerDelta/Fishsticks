// ---- Embed Builder ----

//Imports
const { EmbedBuilder } = require( 'discord.js' );
const { randomFooter } = require( '../Utility/Utils_MessageGenerators' );

//Exports
module.exports = {
	embedBuilder,
	quickEmbed
};

function embedBuilder( fishsticks, embed ) {
	if ( !embed.title || !embed.description ) throw 'Invalid embed object!';
	const data = {
		title: embed.title,
		description: embed.description,
		color: embed.color ? embed.color : fishsticks.CONFIG.colors.primary,
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

function quickEmbed( fishsticks, data ) {
	const qe = new EmbedBuilder();
	qe.setTitle( data.title );
	qe.setDescription( data.description );
	qe.setColor( fishsticks.CONFIG.colors.primary );

	return qe;
}