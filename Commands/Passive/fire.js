// ---- Passive: Fire ----

exports.run = (fishsticks, cmd) => {

    const type = cmd.content[0];

    switch (type) {
        case 'phasers':
            cmd.msg.channel.send('**Aye Captain; firing all phaser banks.**', { files: ['./Images/phasers.gif'] });
            break;
        case 'torpedoes':
            cmd.msg.channel.send('**Aye Captain; firing all photon torpedoes.**', { files: ['./Images/torpedoes.gif'] });
            break;
        default:
            cmd.msg.channel.send('**Aye Captain; firing all weapons.**', { files: ['./Images/weapons.gif'] });
    }
};