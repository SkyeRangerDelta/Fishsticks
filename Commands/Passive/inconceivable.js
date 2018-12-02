exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("Never go in against a sicilian when death is on the line!", {files: ["./images/incon.gif"]});
}