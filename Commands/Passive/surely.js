// ---- Passive: Surely ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    cmd.channel.send({ content: 'I am serious, and dont call me Shirley.', files: ['./Images/Passives/shirley.gif'] });
};