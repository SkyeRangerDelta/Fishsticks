exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("Aye captain.", {files: ["./images/engage.gif"]});
}