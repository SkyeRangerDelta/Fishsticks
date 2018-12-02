exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("Yes yes, it's quite simple really.", {files: ["./images/42.gif"]});
}