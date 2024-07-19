// ---- Interaction Handlers ----

//Imports
const { log } = require('./Utils_Log');
const { handleNotificationToggle } = require('../../Commands/Active/notifications');
const { handleLotteryModal, buyModal } = require('../../Commands/Active/wager');

//Exports
module.exports = {
    handleButtonInteraction,
    handleSelectInteraction,
    handleModalInteraction
};

//Functions
async function handleButtonInteraction(fishsticks, interaction) {
    const intData = interaction.customId.split('-');
    const intID = intData[0];
    switch (intID) {

        default:
            return log('warn', '[INT] No applicable button handler ID');
    }
}

async function handleSelectInteraction(fishsticks, interaction) {
    const intData = interaction.customId.split('-');
    const intID = intData[0];
    switch (intID) {
        case 'NOTI':
            log('info', '[INT] [NOTI] Handling new notification select interaction');
            return handleNotificationToggle(fishsticks, interaction);
        case 'LOT':
            log('info', '[INT] [Lottery] Handling a lottery selection interaction');
            return buyModal(fishsticks, interaction);
        default:
            return log('warn', '[INT] No applicable selection handler ID');
    }
}

async function handleModalInteraction(fishsticks, interaction) {
    const intData = interaction.customId.split('-');
    const intID = intData[0];
    switch (intID) {
        case 'LOT':
            log('info', '[INT] [Lottery] Handling a lottery interaction.');
            return handleLotteryModal(fishsticks, interaction);
        default:
            return log('warn', '[INT] No applicable modal handler.');
    }
}