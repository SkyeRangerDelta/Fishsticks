//CRASH PREVENTION FUNCTION

exports.run = (fishsticks, msg) => {
    msg.reply("[*CPS-SUBR*]Congratulations on your endeavors. I've just saved myself from a catalysmic meltdown. Please don't break me.").then(sent => sent.delete({timeout: 10000}));
    fishsticks.commandAttempts++;
}