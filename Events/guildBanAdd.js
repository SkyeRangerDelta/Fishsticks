// ---- GUILD BAN ADD EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'guildBanAdd',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Guild Member Banned' });
}