// ---- APPLICATION COMMAND CREATE EVENT ----

//Imports
const { Logger } = require( '../Modules/Logger/Log_Handler' );
const { systemTimestamp } = require( '../Modules/Utility/Utils_Time' );
const { embedBuilder } = require( '../Modules/Utility/Utils_EmbedBuilder' );

//Export
module.exports = {
    name: 'applicationCommandCreate',
    once: false,
    execute( fishsticks, appCmd ) {
        Logger( { type: 'App Command Create' } );

        const embed = {
            title: '[Command Created] ' + appCmd.name,
            description: 'A new application command was created.',
            noThumbnail: true,
            footer: {
                text: `Created at ${systemTimestamp( appCmd.createdAt )}`
            },
            fields: [
                {
                    name: 'Description',
                    value: appCmd.description,
                    inline: false
                },
                {
                    name: 'Type',
                    value: appCmd.type,
                    inline: true
                },
                {
                    name: 'Version',
                    value: appCmd.version,
                    inline: true
                },
                {
                    name: 'Command ID',
                    value: appCmd.id,
                    inline: true
                }
            ]
        };

        const bLogger = fishsticks.channels.cache.get( fishsticks.ENTITIES.Channels[ 'bot-logger' ] );
        bLogger.send( { content: '[LOG]', embeds: [embedBuilder( embed )] } );
    }
};