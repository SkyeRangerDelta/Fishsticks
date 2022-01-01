// ---- Passive: Inquisition ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete({ timeout: 0 });
    cmd.channel.send('No one expects the Spanish Inquisition!', { files: ['./Images/Passives/inquisition.gif'] });
};