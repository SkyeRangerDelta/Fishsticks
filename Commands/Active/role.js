//------GAME ROLE SUBROUTINE-------
//=================================

module.exports = {
    run,
    help
}

async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 10000 });

    cmd.msg.reply('Hey.');
}

function help() {
    return 'Enables game role controls.';
}