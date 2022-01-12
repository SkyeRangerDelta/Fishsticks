// ---- Dewit ----

exports.run = (fishsticks, cmd) => {
    const msg = cmd.msg.content.toLowerCase();
    if (msg === 'dewit') {
        cmd.channel.send({ files: ['./Images/Passives/dewit.gif'] });
    }
};