// ---- THREAD DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'threadDelete',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Thread Deleted' });
}