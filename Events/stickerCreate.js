// ---- STICKER CREATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'stickerCreate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Sticker Created' });
}