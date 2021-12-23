// ---- INTERACTION CREATE EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');
const { handleButtonInteraction } = require('../Modules/Utility/Utils_Interactions');

//Export
module.exports = {
    name: 'messageReactionRemove',
    execute
};

async function execute(fishsticks, interaction) {
    log('info', `[CLIENT] New interaction created by ${interaction.member.displayName}. ID: ${interaction.id}`);
    if (interaction.isButton()) {
        await handleButtonInteraction(fishsticks, interaction);
    }
}