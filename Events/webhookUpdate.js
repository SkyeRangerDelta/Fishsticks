// ---- WEBHOOK UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'webhookUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Webhook Updated' });
}