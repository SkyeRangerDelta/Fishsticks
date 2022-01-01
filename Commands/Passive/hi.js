// ---- Passive: Hi ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();

    if (cmd.msg.content.length > 2) return;

    cmd.channel.send('Hello!');
};