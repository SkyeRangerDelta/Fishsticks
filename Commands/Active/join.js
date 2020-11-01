//---**JOIN**----
//Test mode command for firing a member join

//Exports
module.exports = {
    run,
    help
};

//Functions
function run(fishsticks, cmd) {
    fishsticks.emit('guildMemberAdd', cmd.msg.member);
}

function help() {
    return '**Test Mode**: Fires off a member join trigger.';
}