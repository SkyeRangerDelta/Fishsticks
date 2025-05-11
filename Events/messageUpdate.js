// ---- COMMAND EVENT ----

//Imports
const { Logger } = require( '../Modules/Logger/Log_Handler' );
const { systemTimestamp } = require( '../Modules/Utility/Utils_Time' );
const { quickEmbed } = require( '../Modules/Utility/Utils_EmbedBuilder' );

//Exports

module.exports = {
    name: 'messageUpdate',
    execute
};

async function execute( fishsticks, oldMsg, newMsg ) {
    if ( oldMsg.partial || newMsg.partial ) return console.log( 'Partial!' );
    if ( !oldMsg || !newMsg ) return console.log( 'Empty message?' );

    let msgMem;

    try {
        if ( oldMsg.partial ) {

            try {
                await newMsg.fetch();
            }
            catch ( e ) {
                console.log( e );
                return;
            }

            msgMem = await newMsg.member.fetch();
        }
        else {
            msgMem = await oldMsg.member.fetch();
        }
    }
    catch (e) {
        console.error( 'Something about this update is hinky.' );
        return;
    }

    if ( msgMem === fishsticks.member || msgMem.id === fishsticks.user.id || msgMem.user.bot ) return;

    Logger( { type: 'Message Updated' } );

    const qe = {
        title: '[INFO] [CLIENT] [MESSAGE UPDATED]',
        description: `${msgMem.displayName}'s message in ${oldMsg.channel.name} was updated.`
    };

    fishsticks.BOT_LOG.send( { content: `${systemTimestamp()}`, embeds: [quickEmbed( fishsticks, qe )] } );
}