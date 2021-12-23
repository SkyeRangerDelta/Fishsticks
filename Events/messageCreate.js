// ---- MESSAGE EVENT ----

//Imports
const { processMessage } = require('../Modules/Core/Core_Message');

//Export
module.exports = {
    name: 'messageCreate',
    execute
};

async function execute(fishsticks, msg) {
    if (msg.author === fishsticks.user) return;
    if (msg.author.bot) return;

    processMessage(fishsticks, msg);
}