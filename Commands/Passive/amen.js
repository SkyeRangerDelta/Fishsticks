exports.run = (fishsticks, msg, cmd) => {
    msg.delete();
    msg.channel.send("Amen!", {files: ["./images/amen.gif"]});
}