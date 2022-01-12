// ---- Always Watching ----

exports.run = (fishsticks, cmd) => {
    if (cmd.msg.content.toLowerCase() === 'always watching') {
        cmd.channel.send({ files: ['./Images/Passives/alwaysWatching.gif'] });
    }
};