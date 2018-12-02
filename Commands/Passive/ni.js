exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("We are the knights who say....NI!", {files: ["./images/ni.gif"]});
}