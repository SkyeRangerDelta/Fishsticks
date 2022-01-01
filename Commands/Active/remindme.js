//----Remind Me----
// Sets a time out for pinging someone with a message

//Exports
module.exports = {
    run,
    help
};

//Functions
function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    //Syntax: !remindme -[time] -[message]

    const waitTime = parseInt(cmd.content[0]) * 1000 * 60;
    const msgSent = cmd.content[1];

    cmd.reply(`Very good, I'll come find you in ${cmd.content[0]} minutes.`, 10);

    setTimeout(function() {
        cmd.reply(`The time is now!\n${msgSent}`, 30);
    }, waitTime);
}

function help() {
    return 'Pings you with a given message after the set amount of time passes.';
}