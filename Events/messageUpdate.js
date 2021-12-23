// ---- COMMAND EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'messageUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Message Updated' });
}