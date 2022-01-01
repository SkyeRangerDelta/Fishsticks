// ---- GUILD BAN REMOVE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');
const { systemTimestamp } = require('../Modules/Utility/Utils_Time');
const { quickEmbed } = require('../Modules/Utility/Utils_EmbedBuilder');

//Exports

module.exports = {
    name: 'guildBanRemove',
    execute
};

async function execute(fishsticks, ban) {
    Logger({ type: 'Guild Member Unbanned' });

    const qe = {
        title: '[INFO] [CLIENT] [MEMBER UNBANNED]',
        description: `${ban.user.username} was unbanned by ${ban.client.user.username} with reason: ${ban.reason}`
    };

    fishsticks.BOT_LOG.send({ content: `${systemTimestamp()}`, embeds: [quickEmbed(qe)] });
}