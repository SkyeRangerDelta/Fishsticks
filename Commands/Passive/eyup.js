const sysLog = require('../../Modules/Functions/log.js');

exports.run = (fishsticks, msg, cmd) => {

    var replyList = ["'Ello, I'm right chuffed you're 'ere.", "Ey up; people've been keepin' their neb clean 'round 'ere since we last saw ye.", "Aye, fill thi boits while you're 'round."];
    var replyNum = Math.random() * 2;
    replyNum = Math.round(replyNum);

    console.log("[PAS-COMM] Eyup Response: " + replyNum);
    sysLog.run(fishsticks, "[PAS-COMM] Eyup Response: " + replyNum, 0);

    msg.reply(replyList[replyNum]);
}