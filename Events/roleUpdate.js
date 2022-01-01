// ---- ROLE UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'roleUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Role Updated' });
}