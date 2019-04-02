exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let pick = Math.random() * 3;
    pick = Math.round(pick);

    if (pick == 0) {
        msg.channel.send("Amen!", {files: ['./images/amen.gif']});
    } else if (pick == 1) {
        msg.channel.send("Amen!", {files: ['./images/amen_a.gif']});
    } else {
        msg.channel.send("Amen!", {files: ['./images/amen_b.gif']});
    }
}