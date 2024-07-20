// ---- READY EVENT ----

//Imports
const { startUp } = require( '../Modules/Core/Core_Ready' );

//Export
module.exports = {
    name: 'ready',
    once: true,
    execute
};

async function execute( fishsticks ) {
    await startUp( fishsticks );
}
