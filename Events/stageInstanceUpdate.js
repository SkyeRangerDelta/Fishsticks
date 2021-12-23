// ---- STAGE INSTANCE UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'stageInstanceUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Stage Updated' });
}