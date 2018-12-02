exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("FOOTBALL!", {files: ["./images/football.gif"]});
}