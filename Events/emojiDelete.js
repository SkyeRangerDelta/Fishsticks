// ---- EMOJI DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'emojiDelete',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Emoji Delete' });
}