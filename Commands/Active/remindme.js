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

    const waitTime = parseInt(cmd[0]);
    const msgSent = cmd[1];


    setTimeout(function() {
        cmd.msg.reply('The time is now!\n' + msgSent);
    }, waitTime);
}

function help() {
    return 'Pings you with a given message after the set amount of time passes.';
}