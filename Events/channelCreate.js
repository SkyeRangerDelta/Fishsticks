// ---- CHANNEL CREATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'channelCreate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Channel Create' });
}