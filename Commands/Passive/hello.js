// ---- Passive: Hello ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();

    if (cmd.msg.content.length > 5) return;

    cmd.channel.send('Hi There!');
};