// ---- THREAD CREATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'threadCreate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Thread Created' });
}