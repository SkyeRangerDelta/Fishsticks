// ---- Interaction Handlers ----

//Imports
const { log } = require('./Utils_Log');
const { handleInteraction } = require('../../Commands/Active/poll');

//Exports
module.exports = {
    handleButtonInteraction
};

//Functions
async function handleButtonInteraction(fishsticks, interaction) {
    const intID = interaction.customId.substring(0, 4);
    switch (intID) {
        case 'POLL':
            log('info', '[INT] [POLL] Handling new Poll interaction');
            return handleInteraction(fishsticks, interaction);
        default:
            return log('warn', '[INT] No applicable button handler ID');
    }
}