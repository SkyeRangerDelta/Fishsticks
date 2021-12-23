// ---- EMOJI CREATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports
module.exports = {
    name: 'emojiCreate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Emoji Create' });
}