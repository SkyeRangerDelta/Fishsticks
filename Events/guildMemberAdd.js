// ---- GUILD MEMBER ADD EVENT ----

//Imports
const { log } = require( '../Modules/Utility/Utils_Log' );
const { handleNewJoin } = require( '../Modules/Core/Core_NewJoin' );
const { systemTimestamp, convertMsFull } = require( '../Modules/Utility/Utils_Time' );
const { quickEmbed } = require( '../Modules/Utility/Utils_EmbedBuilder' );

//Export
module.exports = {
    name: 'guildMemberAdd',
    execute
};

async function execute( fishsticks, newMember ) {
    log( 'info', `[CLIENT] ${newMember.nickname} joined the server.` );
    handleNewJoin( fishsticks, newMember );

    const timeNow = Date.now();
    const qe = {
        title: '[INFO] [CLIENT] [NEW MEMBER]',
        description: `${newMember.displayName} joined at ${systemTimestamp()}. Account date: ${newMember.created} (${convertMsFull( newMember.createdAt - timeNow )})`
    };

    fishsticks.BOT_LOG.send( { content: `${systemTimestamp()}`, embeds: [quickEmbed( fishsticks, qe )] } );
}