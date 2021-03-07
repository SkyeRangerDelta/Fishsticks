// ---- Handle Old Member ----
// Handles member departure

//Imports
const { clearRecord } = require('../Utility/Utils_User');

//Exports
module.exports = {
    handleOldMember
};

//Functions
function handleOldMember(fishsticks, oldMember) {
    clearRecord(fishsticks, oldMember); //Clear member's record
}