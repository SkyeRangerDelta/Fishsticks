// ---- GUILD BAN REMOVE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'guildBanRemove',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Guild Member Unbanned' });
}