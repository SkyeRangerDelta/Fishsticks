// ---- GUILD MEMBER ADD EVENT ----

//Imports
const { log } = require( '../Modules/Utility/Utils_Log' );
const { handleOldMember } = require( '../Modules/Core/Core_OldMember' );
const { systemTimestamp, convertMsFull } = require( '../Modules/Utility/Utils_Time' );
const { quickEmbed } = require( '../Modules/Utility/Utils_EmbedBuilder' );

//Export
module.exports = {
    name: 'guildMemberRemove',
    execute
};

async function execute( fishsticks, prevMember ) {
    log( 'info', `[CLIENT] ${prevMember.nickname} departed the server.` );
    handleOldMember( fishsticks, prevMember );

    const timeNow = Date.now();
    const qe = {
        title: '[INFO] [CLIENT] [EXITED MEMBER]',
        description: `${prevMember.displayName} departed at ${systemTimestamp()}. Account date: ${prevMember.created} (${convertMsFull( prevMember.createdAt - timeNow )})`
    };

    fishsticks.BOT_LOG.send( { content: `${systemTimestamp()}`, embeds: [quickEmbed( qe )] } );
}