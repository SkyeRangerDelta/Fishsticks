// ---- INTERACTION CREATE EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');
const {
    handleButtonInteraction,
    handleSelectInteraction,
    handleModalInteraction } = require('../Modules/Utility/Utils_Interactions');
const { generateErrorMsg } = require('../Modules/Utility/Utils_Aux');
const { fso_query } = require('../Modules/FSO/FSO_Utils');

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
    else if (interaction.isModalSubmit()) {
        await handleModalInteraction(fishsticks, interaction);
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

            //Success here
            log('info', '[ACTIVE-CMD] Executed successfully.');
            await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', {
                $inc: {
                    acAttempts: 1,
                    acSuccess: 1
                }
            }, { id: interaction.member.id });
            await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', {
                $inc: {
                    cmdQueriesSucc: 1
                }
            }, { id: 1 });
        }
        catch (cmdErr) {

            //Fail here
            const upVal = {
                $inc: {
                    acAttempts: 1
                }
            };

            log('warn', '[ACTIVE-CMD] Execution failed.\n' + cmdErr);
            await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', upVal, { id: interaction.member.id });
            await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', {
                $inc: {
                    cmdQueriesFail: 1
                }
            }, { id: 1 });

            if (!interaction) {
                return;
            }
            else if (interaction.deferred || interaction.replied) {
                await interaction.followUp('IM ON BLOODY FIRE!\n' + cmdErr);
                log('err', '[INTERACTION] AAAAAAAHHHHHHHHHHHHHH - DO SOMETHING.');
            }
            else {
                await interaction.reply('Looks like weve got a very serious situation on our hands.\n' + generateErrorMsg() + '\n' + cmdErr);
            }
        }
    }
}