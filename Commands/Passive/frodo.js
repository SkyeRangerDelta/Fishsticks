//Frodo

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();
	msg.channel.send({files: ["./images/frodobiggins.gif"]});
}