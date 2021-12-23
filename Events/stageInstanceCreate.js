// ---- STAGE INSTANCE CREATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'stageInstanceCreate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Stage Created' });
}