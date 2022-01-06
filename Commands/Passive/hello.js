// ---- Passive: Hello ----

exports.run = (fishsticks, cmd) => {
    if (!cmd.msg.content.length > 5) {
        cmd.channel.send('Hi There!');
    }
    else if (cmd.msg.content.toLowerCase() === 'hello there') {
        if (cmd.msg.author.id === fishsticks.RANGER.id) {
            cmd.channel.send({ content: `General ${cmd.msg.member.displayName}!`, files: ['./Images/Passives/grievous2.gif'] });
        }
        else {
            cmd.channel.send({ content: `General ${cmd.msg.member.displayName}!`, files: ['./Images/Passives/grievous.gif'] });
        }
    }
};