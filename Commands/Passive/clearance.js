exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("Roger, Roger!", {files: ["./images/clearance.gif"]});
}