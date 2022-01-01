// ---- Utils Terminate ----

//Exports
module.exports = {
    terminate
};

//Functions
async function terminate(fishsticks) {
    if (fishsticks.FSO_CONNECTION) {
        await fishsticks.FSO_CONNECTION.close();
    }

    if (fishsticks) {
        await fishsticks.CONSOLE.send('[Auxiliary Override] Controller terminating.');
        fishsticks.destroy();
    }
    process.exit(1);
}