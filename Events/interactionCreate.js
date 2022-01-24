// ---- INTERACTION CREATE EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');
const { handleButtonInteraction, handleSelectInteraction } = require('../Modules/Utility/Utils_Interactions');
const { generateErrorMsg } = require('../Modules/Utility/Utils_Aux');

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
    else if (interaction.isCommand()) {
        const cmd = fishsticks.CMDS.get(interaction.commandName);
        if (!cmd) {
            return interaction.reply(generateErrorMsg() + '\nI couldnt find that command!');
        }

        try {
            await cmd.run(fishsticks, interaction);
        }
        catch (cmdErr) {
            if (!interaction) {
                return;
            }
            else if (interaction.deferred || interaction.replied) {
                await interaction.followUp('IM ON BLOODY FIRE!');
                log('err', '[INTERACTION] AAAAAAAHHHHHHHHHHHHHH - DO SOMETHING.');
            }
            else {
                await interaction.reply('Looks like weve got a very serious situation on our hands.\n' + generateErrorMsg() + '\n' + cmdErr);
            }
        }
    }
}