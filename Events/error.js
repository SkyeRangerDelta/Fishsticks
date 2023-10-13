// ---- ERROR EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');

//Export
module.exports = {
    name: 'error',
    execute(fishsticks, err) {
        log('err', `[CLIENT] ${err}\n${err.stack}`);
    }
};