// ---- GUILD MEMBER UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');
const { systemTimestamp } = require('../Modules/Utility/Utils_Time');
const { quickEmbed } = require('../Modules/Utility/Utils_EmbedBuilder');

//Exports

module.exports = {
    name: 'guildMemberUpdate',
    execute
};

async function execute(fishsticks, oldMem, newMem) {
    Logger({ type: 'Guild Member Updated' });

    const qe = {
        title: '[INFO] [CLIENT] [MEMBER UPDATED]',
        description: `${oldMem ? oldMem.displayName : newMem.displayName} was updated.`
    };

    fishsticks.BOT_LOG.send({ content: `${systemTimestamp()}`, embeds: [quickEmbed(qe)] });
}