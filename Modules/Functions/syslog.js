// SYSTEM LOG
const log = require('./log.js');

exports.run = (fishsticks, message, level) => {
    try {
        console.log(message);
        log.run(fishsticks, message, level);
    }
    catch (err) {
        console.log("[SELF-LOG] Write Error!");
        fishsticks.systemLog.send("**[SOMETHING IS WRONG]** I tried to send a message via a command, but something has gone askew. (Origin: Core Script)\n\nDetailing:\n" + err);
    }
}