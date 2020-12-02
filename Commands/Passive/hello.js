// ---- Passive: Hello ----

exports.run = (fishsticks, cmd) => {

    if (cmd.msg.content.length > 5) return;

    cmd.msg.channel.send('Hi There!');
};