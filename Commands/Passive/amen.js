// ---- Passive: Amen ----

exports.run = (fishticks, cmd) => {
    const pick = Math.round(Math.random() * 3);

    switch (pick) {
        case 0:
            cmd.msg.channel.send('Amen!', { files: ['./Images/amen.gif'] });
            break;
        case 1:
            cmd.msg.channel.send('Amen!', { files: ['./Images/amen_a.gif'] });
            break;
        default:
            cmd.msg.channel.send('Amen!', { files: ['./Images/amen_b.gif'] });
    }
};