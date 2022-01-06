// ---- Meaning of Life

exports.run = (fishsticks, cmd) => {
    const msg = cmd.msg.content.toLowerCase();
    const triggers = ['of life', 'of the universe', 'of everything'];

    for (const trig in triggers) {
        if (msg.includes(triggers[trig])) {
            cmd.channel.send({ files: ['./Images/Passives/42.gif'] });
        }
    }
};