// ---- ROLE DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'roleDelete',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Role Deleted' });
}