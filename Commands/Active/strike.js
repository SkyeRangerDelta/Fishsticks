// ---- Strike ----
//Issues a den strike to someone

//Imports

//Exports
module.exports = {
    run,
    help
};

//Functions
function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });
    cmd.msg.reply({ content: 'Nonono, not yet.' })
        .then(sent => sent.delete({ timeout: 10000 }));
}

function help() {
    return 'Moderation command for den strikes.';
}