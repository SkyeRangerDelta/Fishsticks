// ---- ROLE CREATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'roleCreate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Role Created' });
}