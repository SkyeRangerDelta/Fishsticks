// ---- Ludicrous Speed ----

exports.run = (fishsticks, cmd) => {
    const msg = cmd.msg.content.toLowerCase();
    if (msg === 'ludicrous speed') {
        cmd.channel.send({ files: ['./Images/Passives/highGround.gif'] });
    }
};