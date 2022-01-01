// ---- Passive: Break ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    cmd.msg.reply({ content: 'Bet you thought that would work. Ha, BEGONE.' });
};