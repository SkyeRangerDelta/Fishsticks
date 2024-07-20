// ---- Passive: Frodo ----

exports.run = ( fishsticks, cmd ) => {
	cmd.msg.delete();
	cmd.channel.send( { files: ['./Images/Passives/frodobiggins.gif'] } );
};