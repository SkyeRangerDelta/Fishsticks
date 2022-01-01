// ----- Logger Handler -----
// Processes logging for client events

//Imports
const { log } = require('../Utility/Utils_Log');
const { bLogger } = require('../Core/Core_ids.json');

//Exports
module.exports = {
    Logger
};

//Main
function Logger(data) {
    log('info', '[INFO] Log Event: ' + data.type);
    log('info', 'Something useful here eventually.');
}