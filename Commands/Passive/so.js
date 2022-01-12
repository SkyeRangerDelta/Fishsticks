// ---- So It Begins ----

exports.run = (fishsticks, cmd) => {
    const msg = cmd.msg.content.toLowerCase();
    if (msg === 'so it begins') {
        cmd.channel.send({ files: ['./Images/Passives/soitbegins.gif'] });
    }
};