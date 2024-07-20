// ---- CHANNEL UPDATE EVENT ----

//Imports
const { Logger } = require( '../Modules/Logger/Log_Handler' );
const { systemTimestamp } = require( '../Modules/Utility/Utils_Time' );
const { quickEmbed } = require( '../Modules/Utility/Utils_EmbedBuilder' );

//Exports

module.exports = {
    name: 'channelUpdate',
    execute
};

async function execute( fishsticks, oldCH, newCH ) {
    Logger( { type: 'Channel Update' } );

    const qe = {
        title: '[INFO] [CLIENT] [CHANNEL UPDATE]',
        description: `${oldCH.name} was updated.`
    };

    console.log( newCH.name );

    fishsticks.BOT_LOG.send( { content: `${systemTimestamp()}`, embeds: [quickEmbed( qe )] } );
}