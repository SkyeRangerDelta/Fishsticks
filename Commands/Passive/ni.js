// ---- Passive: Ni ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    cmd.channel.send({ content: 'We are the knights who say....NI!', files: ['./Images/Passives/ni.gif'] });
};