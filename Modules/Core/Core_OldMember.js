// ---- Handle Old Member ----
// Handles member departure

//Imports
const { clearRecord } = require( '../Utility/Utils_User' );

//Exports
module.exports = {
    handleOldMember
};

//Functions
async function handleOldMember( fishsticks, oldMember ) {
    await clearRecord( fishsticks, oldMember ); //Clear member's record
}