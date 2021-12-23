// ---- STICKER UPDATE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'stickerUpdate',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Sticker Updated' });
}