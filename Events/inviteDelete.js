// ---- INVITE DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'inviteDelete',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Invite Deleted' });
}