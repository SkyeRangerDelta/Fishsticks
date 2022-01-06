// ---- A lot of damage ----

exports.run = (fishsticks, cmd) => {
    const msg = cmd.msg.content.toLowerCase();
    if (msg === 'a lot of damage') {
        cmd.channel.send({ files: ['./Images/Passives/alotofdamage.gif'] });
    }
};