//----BaconMode----

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});
    
    //Collect target
    let target = msg.mentions.users.first();

    //Validate
    if (!target || target == null || target == undefined) {
        console.log("[BAC-MODE] Target found to be null.");
        msg.reply("Clearing the bacon target.").then(sent => sent.delete({timeout: 10000}));
        return fishsticks.baconTarget = null;
    }

    //Set target global
    try {
        fishsticks.baconTarget = target;
    } catch (error) {
        throw "Bacon mode couldn't engage!"
    }

    msg.reply("Bacon mode engaged!").then(sent => sent.delete({timeout: 10000}));

}