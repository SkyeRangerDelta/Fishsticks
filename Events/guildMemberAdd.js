// ---- GUILD MEMBER ADD EVENT ----

//Imports
const { log } = require('../Modules/Utility/Utils_Log');
const { handleNewJoin } = require('../Modules/Core/Core_NewJoin');

//Export
module.exports = {
    name: 'guildMemberAdd',
    execute
};

async function execute(fishsticks, newMember) {
    log('info', `[CLIENT] ${newMember.nickname} joined the server.`);
    handleNewJoin(fishsticks, newMember);
}