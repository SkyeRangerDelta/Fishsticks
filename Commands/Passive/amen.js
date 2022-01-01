// ---- Passive: Amen ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    const pick = Math.round(Math.random() * 3);

    switch (pick) {
        case 0:
            cmd.channel.send({ content: 'Amen!', files: ['./Images/Passives/amen.gif'] });
            break;
        case 1:
            cmd.channel.send({ content: 'Amen!', files: ['./Images/Passives/amen_a.gif'] });
            break;
        default:
            cmd.channel.send({ content: 'Amen!', files: ['./Images/Passives/amen_b.gif'] });
    }
};