// ---- High Ground Alt ----

exports.run = (fishsticks, cmd) => {
    const msg = cmd.msg.content.toLowerCase();
    if (msg.includes('high ground')) {
        cmd.channel.send({ files: ['./Images/Passives/highGround.gif'] });
    }
};