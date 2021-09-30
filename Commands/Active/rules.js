// ----- Rules -----
// Links to the rules channel

//Imports
const { rules } = require('../../Modules/Core/Core_ids.json');

module.exports = {
    run,
    help
};

async function run(fishsticks, cmd) {
    const ruleCh = await fishsticks.channels.cache.get(rules);
    cmd.reply(`See ${ruleCh}`, 10000);
}

function help() {
    return 'Links to #rules';
}