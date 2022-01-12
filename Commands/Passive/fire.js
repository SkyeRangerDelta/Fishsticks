// ---- Passive: Fire ----

exports.run = (fishsticks, cmd) => {

    const type = cmd.content[0];

    switch (type) {
        case 'phasers':
            cmd.channel.send({ content: '**Aye Captain; firing all phaser banks.**', files: ['./Images/Passives/phasers.gif'] });
            break;
        case 'torpedoes':
            cmd.channel.send({ content: '**Aye Captain; firing all photon torpedoes.**', files: ['./Images/Passives/torpedoes.gif'] });
            break;
        default:
            cmd.channel.send({ content: '**Aye Captain; firing all weapons.**', files: ['./Images/Passives/weapons.gif'] });
    }
};