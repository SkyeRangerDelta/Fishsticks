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
    if (cardName == 'brodemode') {
        fishsticks.SUMM_BRODEMODE = !fishsticks.SUMM_BRODEMODE;

        if (fishsticks.SUMM_BRODEMODE) {
            return cmd.channel.send('Brodemode is now on! Play by the rules or get out of my server.').then(sent => sent.delete({ timeout: 15000 }));
        }
        else {
            return cmd.channel.send('Brodemode is now off! *Brode Laughter* Ben drowned on his own spit laughing.').then(sent => sent.delete({ timeout: 15000 }));
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
            const cardFile = require(`./Summons/${cardName}.png`);
            cmd.channel.send({ files: [cardFile] });
        }
    }
    catch (summonErr) {
        return cmd.msg.reply({ content: '*You failed to summon that, perhaps you have no mana?*' })
            .then(sent => sent.delete({ timeout: 10000 })); //Friendly response on failure
    }
}

function help() {
    return 'Summons cards!';
}