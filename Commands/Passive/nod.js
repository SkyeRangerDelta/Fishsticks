// ---- Passive: Nod ----

exports.run = (fishsticks, cmd) => {
	cmd.msg.channel.send('*Nods*', { files: ['./images/gandalfnod.gif'] });
};