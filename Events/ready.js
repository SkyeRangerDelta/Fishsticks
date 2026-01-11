// ---- READY EVENT ----

//Imports
const { startUp } = require( '../Modules/Core/Core_Ready' );

//Export
module.exports = {
    name: 'clientReady',
    once: true,
    execute
};

async function execute( fishsticks ) {
    await startUp( fishsticks );
}
