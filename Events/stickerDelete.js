// ---- STICKER DELETE EVENT ----

//Imports
const { Logger } = require('../Modules/Logger/Log_Handler');

//Exports

module.exports = {
    name: 'stickerDelete',
    execute
};

async function execute(fishsticks) {
    Logger({ type: 'Sticker Deleted' });
}