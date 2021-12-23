// ---- GUILD MEMBER UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'guildMemberUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Guild Member Updated' });
}