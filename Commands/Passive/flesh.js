// ---- Flesh Wound ----

exports.run = (fishsticks, cmd) => {
    if (cmd.msg.content.toLowerCase() === 'flesh wound') {
        cmd.channel.send({ files: ['./Images/Passives/fleshWound.gif'] });
    }
};