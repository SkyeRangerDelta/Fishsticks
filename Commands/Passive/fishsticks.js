// ---- Passive: Fishsticks ----

exports.run = (fishsticks, cmd) => {

    if (cmd.msg.content.length > 10) return;

    cmd.channel.send('Mmmm, fishsticks....', { files: ['./Images/fsimg.jpg'] });
};