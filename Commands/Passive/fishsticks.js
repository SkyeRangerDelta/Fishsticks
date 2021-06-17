// ---- Passive: Fishsticks ----

exports.run = (fishsticks, cmd) => {

    if (cmd.msg.content.length > 10) return;

    cmd.msg.channel.send('Mmmm, fishsticks....', { files: ['./Images/fsimg.jpg'] });
};