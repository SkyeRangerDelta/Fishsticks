// ---- Passive: Troll ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    cmd.channel.send({ content: 'FOOTBALL!', files: ['./Images/Passives/football.gif'] });
};