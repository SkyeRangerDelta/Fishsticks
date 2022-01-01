// ---- Passive: I've got time ----

exports.run = (fishsticks, cmd) => {
    if (cmd.msg.content.toLowerCase() === 'ive got time') {
        cmd.msg.reply({ content: `Yeah, I've got time.`, files: ['./Images/Passives/gotTime.gif'] });
    }
};