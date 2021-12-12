// ----- Logger Handler -----
// Processes logging for client events

//Imports
const fs = require('fs');

const { log } = require('/Modules/Utility/Utils_Log');

//Exports
module.exports = {
    Logger,
    readEvents
};

//Class
class Logger {
    constructor(fishsticks, eventData) {
        log('info', '[LOGGER] Received new event.');
    }
}

//Indexer
function readEvents() {
    const eventHandlers = fs.readdirSync('./Modules/Logger/Events');
    for (const file in eventHandlers) {

    }
}