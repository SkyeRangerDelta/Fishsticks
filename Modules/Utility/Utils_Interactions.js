// ---- Interaction Handlers ----

//Imports
const { log } = require('./Utils_Log');

//Exports
module.exports = {
    handleButtonInteraction
};

//Functions
async function handleButtonInteraction(fishsticks, interaction) {
    const btnCollector = interaction.message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

    btnCollector.on('collect', i => {
        log('info', '[INT-BUTTON] Button collector fired.');
    });
}