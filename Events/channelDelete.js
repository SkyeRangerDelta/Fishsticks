// ---- CHANNEL DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'channelDelete',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Channel Delete' });
}