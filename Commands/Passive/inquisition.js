// ---- Passive: Inquisition ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete({ timeout: 0 });
    cmd.msg.channel.send('No one expects the Spanish Inquisition!', { files: ['./images/inquisition.gif'] });
};