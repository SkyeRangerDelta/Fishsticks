exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("Thou holy hand grenade?", {files: ["./images/grenade1.gif"]});
}