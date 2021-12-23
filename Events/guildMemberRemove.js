// ---- GUILD MEMBER ADD EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');
const { handleOldMember } = require('../Modules/Core/Core_OldMember');

//Export
module.exports = {
    name: 'guildMemberRemove',
    execute
};

async function execute(fishsticks, prevMember) {
    log('info', `[CLIENT] ${prevMember.nickname} departed the server.`);
    handleOldMember(fishsticks, prevMember);
}