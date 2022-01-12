// ---- INTERACTION CREATE EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');
const { handleButtonInteraction, handleSelectInteraction } = require('../Modules/Utility/Utils_Interactions');

//Export
module.exports = {
    name: 'interactionCreate',
    execute
};

async function execute(fishsticks, interaction) {
    log('info', `[CLIENT] New interaction created by ${interaction.member.displayName}. ID: ${interaction.id}`);
    if (interaction.isButton()) {
        await handleButtonInteraction(fishsticks, interaction);
    }
    else if (interaction.isSelectMenu()) {
        await handleSelectInteraction(fishsticks, interaction);
    }
}