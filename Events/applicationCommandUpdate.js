// ---- APPLICATION COMMAND UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports
module.exports = {
    name: 'applicationCommandUpdate',
    execute
};

async function execute(fishsticks, appCmd) {
    Logger({ type: 'App Command Update' });
}