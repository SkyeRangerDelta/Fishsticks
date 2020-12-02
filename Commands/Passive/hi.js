// ---- Passive: Hi ----

exports.run = (fishsticks, cmd) => {

    if (cmd.msg.content.length > 2) return;

    cmd.msg.channel.send('Hello!');
};