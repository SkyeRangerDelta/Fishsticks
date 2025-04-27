// ---- GUILD BAN ADD EVENT ----

//Imports
const { Logger } = require( '../Modules/Logger/Log_Handler' );
const { systemTimestamp } = require( '../Modules/Utility/Utils_Time' );
const { quickEmbed } = require( '../Modules/Utility/Utils_EmbedBuilder' );

//Exports

module.exports = {
    name: 'guildBanAdd',
    execute
};

async function execute( fishsticks, ban ) {
    Logger( { type: 'Guild Member Banned' } );

    const qe = {
        title: '[INFO] [CLIENT] [MEMBER BANNED]',
        description: `${ban.user.username} was banned by ${ban.client.user.username} with reason: ${ban.reason}`
    };

    fishsticks.BOT_LOG.send( { content: `${systemTimestamp()}`, embeds: [quickEmbed( fishsticks, qe )] } );
}