// ---- APPLICATION COMMAND DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports
module.exports = {
    name: 'applicationCommandDelete',
    execute
};

async function execute(fishsticks, appCmd) {
    Logger({ type: 'App Command Delete' });
}