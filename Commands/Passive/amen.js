// ---- Passive: Amen ----

exports.run = (fishticks, cmd) => {
    const pick = Math.round(Math.random() * 3);

    switch (pick) {
        case 0:
            cmd.msg.channel.send('Amen!', { files: ['./images/amen.gif'] });
            break;
        case 1:
            cmd.msg.channel.send('Amen!', { files: ['./images/amen_a.gif'] });
            break;
        default:
            cmd.msg.channel.send('Amen!', { files: ['./images/amen_b.gif'] });
    }
};