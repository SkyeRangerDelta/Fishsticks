const Discord = require('discord.js');

exports.run = (fishsticks, toLog, logLevel) => {
    let systemLog = fishsticks.systemLog;

    switch (logLevel) {
        case 0:
            systemLog.send(
                "```CSS\n" + toLog + "\n```"
            );
            break;
        case 1:
            systemLog.send(
                "```yaml\n" + toLog + "\n```"
            );
            break;
        case 2:
            systemLog.send(
                "```md\n" + toLog + "\n```"
            );
            break;
        case 3:
            systemLog.send(
                "```fix\n" + toLog + "\n```"
            );
            break;
        case 4:
            systemLog.send(
                "```diff\n" + toLog + "\n```"
            );
            break;
        default:
            systemLog.send(
                "```diff\n[SYSTEM LOGGER ROUTINE]\nSomething broke in here somewhere. Perhaps an invalid logging level?"
            )
        }
}