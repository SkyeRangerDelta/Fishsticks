// ---- CHANNEL UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'channelUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Channel Update' });
}