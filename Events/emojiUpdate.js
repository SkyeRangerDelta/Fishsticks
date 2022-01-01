// ---- EMOJI UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'emojiUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Emoji Update' });
}