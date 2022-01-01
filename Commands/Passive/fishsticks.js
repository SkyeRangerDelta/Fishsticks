// ---- Passive: Fishsticks ----

exports.run = (fishsticks, cmd) => {

    if (cmd.msg.content.length > 10) return;

    cmd.channel.send({ content: 'Mmmm, fishsticks....', files: ['./Images/Passives/fsimg.jpg'] });
};