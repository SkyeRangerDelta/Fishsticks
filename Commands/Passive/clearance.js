// ---- Passive: Clearance ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    cmd.channel.send({ content: 'Roger, Roger!', files: ['./Images/Passives/clearance.gif'] });
};