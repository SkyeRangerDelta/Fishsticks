// ---- WARN EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');

//Export
module.exports = {
    name: 'warn',
    execute(fishsticks, warn) {
        log('warn', `[CLIENT] ${warn}`);
    }
};