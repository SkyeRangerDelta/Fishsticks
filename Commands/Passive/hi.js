// ---- Passive: Hi ----

exports.run = (fishsticks, cmd) => {

    if (cmd.msg.content.length > 2) return;

    cmd.channel.send('Hello!');
};