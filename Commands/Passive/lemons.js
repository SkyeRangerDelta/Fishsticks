// ---- Passive: Lemons ----

exports.run = (fishsticks, cmd) => {
    cmd.msg.delete();
    cmd.channel.send({ content: `"I’ve been thinking. When life gives you lemons? Don’t make lemonade. Make life take the lemons back! Get mad! I don’t want your darn lemons! What am I supposed to do with these? Demand to see life’s manager! Make life rue the day it thought is could give me lemons! Do you know who I am? I’m the man who’s going to burn your house down! With the lemons! I’m going to get my engineers to invent a combustible lemon that burns your house down!"`, files: ['./Images/Passives/lemons.png'] });
};