// ---- Passive: Inquisition ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    cmd.channel.send({ content: 'No one expects the Spanish Inquisition!', files: ['./Images/Passives/inquisition.gif'] });
};