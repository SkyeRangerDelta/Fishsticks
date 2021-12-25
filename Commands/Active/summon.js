//----SUMMON----

//Imports
const { log } = require('../../Modules/Utility/Utils_Log.js');

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {

    cmd.msg.delete({ timeout: 0 });

    //Set card name
    const cardName = cmd.content[0]; //Process card name from command

    //BrodeMode Toggle
    if (cardName === 'brodemode') {
        fishsticks.SUMM_BRODEMODE = !fishsticks.SUMM_BRODEMODE;

        if (fishsticks.SUMM_BRODEMODE) {
            return cmd.channel.send('Brodemode is now on! Play by the rules or get out of my server.')
                .then(s => { setTimeout(() => s.delete(), 15000); });
        }
        else {
            return cmd.channel.send('Brodemode is now off! *Brode Laughter* Ben drowned on his own spit laughing.')
                .then(s => { setTimeout(() => s.delete(), 60000); });
        }
    }

    log('info', '[SUMMON] Attempting to summon a card.');

    /*
    --> Not implemented yet.

    const restrictedCards = [
        'shaddodgeling',
        'futronbobs scheme',
        'enhance',
        'snek',
        'the door'
    ]; //List of "subcards" and/or other cards that cannot be simply played

    */

    try { //Attempt to summon/execute
        if (fishsticks.SUMM_BRODEMODE === false) {
            cmd.channel.send({ files: [{
                    attachment: `./Commands/Active/Summons/${cardName}.png`
                }] });
        }
    }
    catch (summonErr) {
        log('info', '[SUMMON] Summon Err\n' + summonErr);
        return cmd.reply('*You failed to summon that, perhaps you have no mana?*', 10000); //Friendly response on failure
    }
}

function help() {
    return 'Summons cards!';
}