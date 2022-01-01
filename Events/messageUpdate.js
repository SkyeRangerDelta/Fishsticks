// ---- COMMAND EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');
const { systemTimestamp } = require('../Modules/Utility/Utils_Time');
const { quickEmbed } = require('../Modules/Utility/Utils_EmbedBuilder');

//Exports

module.exports = {
    name: 'messageUpdate',
    execute
};

async function execute(fishsticks, oldMsg, newMsg) {
    Logger({ type: 'Message Updated' });

    const qe = {
        title: '[INFO] [CLIENT] [MESSAGE UPDATED]',
        description: `${oldMsg.member.displayName}'s message in ${oldMsg.channel.name} was updated.`
    };

    fishsticks.BOT_LOG.send({ content: `${systemTimestamp()}`, embeds: [quickEmbed(qe)] });
}