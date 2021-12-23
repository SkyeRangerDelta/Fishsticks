// ---- INVITE CREATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'inviteCreate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Invite Created' });
}