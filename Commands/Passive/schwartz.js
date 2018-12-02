exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    msg.channel.send("May da schwartz be wid you.", {files: ["./images/schwartz.gif"]});
}