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
    if (oldMsg.partial || newMsg.partial) console.log('Partial!');

    let msgMem;
    if (oldMsg.partial) {
        await newMsg.fetch();
        msgMem = newMsg.member.fetch();
    }
    else {
        msgMem = oldMsg.member.fetch();
    }

    if (msgMem === fishsticks.member || msgMem.id === fishsticks.user.id || msgMem.user.bot) return;

    Logger({ type: 'Message Updated' });

    const qe = {
        title: '[INFO] [CLIENT] [MESSAGE UPDATED]',
        description: `${msgMem.displayName}'s message in ${oldMsg.channel.name} was updated.`
    };

    fishsticks.BOT_LOG.send({ content: `${systemTimestamp()}`, embeds: [quickEmbed(qe)] });
}