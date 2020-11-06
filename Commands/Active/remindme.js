//----Remind Me----
const Discord = require('discord.js');

module.exports = {
    run,
    help
}

function run (fishsticks, cmd) {
    msg.delete({timeout: 0});

    //Command breakup
    let alt = msg.content.split("-");

    let waitTime = parseInt(alt[1]);
    let msgSent = alt.splice(2).join(' ');


    //Logic
    if (typeof waitTime != typeof 1 || waitTime == undefined || waitTime == NaN || waitTime == 0) {
        msg.reply("I'd love to remind you. How about I remind you now.\n\n" + msgSent +
        "\n\nYou know, because if you want me to wait, you should give me a time (that is also not 0).");
    }
    let dispatchTime = (waitTime * 60) * 1000;

    msg.reply("Roger that, reminding you of whatever that is in " + waitTime + " minutes.").then(sent => sent.delete({timeout: 10000}));

    setTimeout(sendIt, dispatchTime, msgSent);

    function sendIt(it) {
        msg.reply("The time is now!\n\n" + it);
    }
}

function help() {
    return 'Pings you with a given message after the set amount of time passes.';
}