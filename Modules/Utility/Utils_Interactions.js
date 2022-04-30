// ---- Interaction Handlers ----

//Imports
const { log } = require('./Utils_Log');
const { handleInteraction } = require('../../Commands/Active/poll');
const { handleNotificationToggle } = require('../../Commands/Active/notifications');

//Exports
module.exports = {
    handleButtonInteraction,
    handleSelectInteraction
};

//Functions
async function handleButtonInteraction(fishsticks, interaction) {
    const intData = interaction.customId.split('-');
    const intID = intData[0];
    switch (intID) {
        case 'POLL':
            log('info', '[INT] [POLL] Handling new Poll interaction');
            return handleInteraction(fishsticks, interaction, null);

        default:
            return log('warn', '[INT] No applicable button handler ID');
    }
}

async function handleSelectInteraction(fishsticks, interaction) {
    const intData = interaction.customId.split('-');
    const intID = intData[0];
    switch (intID) {
        case 'NOTI':
            log('info', '[INT] [NOTI] Handling new selection interaction');
            return handleNotificationToggle(fishsticks, interaction);

        default:
            return log('warn', '[INT] No applicable selection handler ID');
    }
}