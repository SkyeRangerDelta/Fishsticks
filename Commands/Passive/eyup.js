// ---- Passive: Eyup ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();

    const replyList = ["'Ello, I'm right chuffed you're 'ere.", "Ey up; people've been keepin' their neb clean 'round 'ere since we last saw ye.", "Aye, fill thi boits while you're 'round."];
    const replyNum = Math.round(Math.random() * 2);

    cmd.channel.send(replyList[replyNum]);
};