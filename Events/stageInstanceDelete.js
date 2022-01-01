// ---- STAGE INSTANCE DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'stageInstanceDelete',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Stage Deleted' });
}