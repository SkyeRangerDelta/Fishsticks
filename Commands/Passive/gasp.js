// ---- Passive: Gasp ----

exports.run = (fishsticks, cmd) => {
	cmd.msg.delete();
	cmd.channel.send({ files: ['./Images/Passives/gasp.gif'] });
};