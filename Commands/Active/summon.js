//----SUMMON----
const syslog = require('./../../Modules/Functions/syslog.js');
const fs = require('fs');

exports.run = async (fishsticks, msg, cmd) => {

    msg.delete();

    let cardName = cmd.splice(0).join(' '); //Process card name from command

    if (cardName == "brodemode") {
        fishsticks.brodemode = !fishsticks.brodemode;
        
        if (fishsticks.brodemode) {
            return msg.channel.send("Brodemode is now on! Play by the rules or get out of my server.").then(sent => sent.delete(15000));
        } else {
            return msg.channel.send("Brodemode is now off! *Brode Laughter* Ben drowned on his own spit laughing.").then(sent => sent.delete("20000"));
        }
    }

    syslog.run(fishsticks, "[SUMMON] Attempting to summon entity", 1);

    let invalidCardSummons = ["shaddodgeling", "futronbob's scheme", "enhance", "snek", "the door"]; //List of "subcards" and/or other cards that cannot be simply played

    try { //Attempt to summon/execute
        if (fishsticks.brodemode === false) {
            if (fs.existsSync(`./Commands/Active/Summons/images/${cardName}.png`)) { //Test path
                syslog.run(fishsticks, "Image Exists", 1);
                fishsticks.cardsPlayed.push(cardName); //Add card to played cards stack
                return msg.channel.send({files: [`./Commands/Active/Summons/images/${cardName}.png`]});
            }
        }

        for (item in fishsticks.cardsPlayed) {
            if (fishsticks.cardsPlayed[item] == cardName) {
                return msg.reply("*You've already played this card!*").then(sent => sent.delete(10000));
            }
        }

        for (card in invalidCardSummons) { //Iterate through invalid summons
            if (invalidCardSummons[card] == cardName) { //If card being summoned is in list...
                return msg.reply("*You cannot summon this card!*").then(sent => sent.delete(10000)); //...do not summon card
            }
        }

        if (fs.existsSync(`./Commands/Active/Summons/images/${cardName}.png`)) { //Test path
            syslog.run(fishsticks, "Image Exists", 1);
            fishsticks.cardsPlayed.push(cardName); //Add card to played cards stack
            return msg.channel.send({files: [`./Commands/Active/Summons/images/${cardName}.png`]});
        }

        syslog.run(fishsticks, "[SUMMON] Success!", 2); //Log result
    } catch (summonErr) {
        syslog.run(fishsticks, "[SUMMON] Failed!\n" + summonErr, 3); //Log result if failure
        return msg.reply("*You failed to summon that, perhaps you have no mana?*").then(sent => sent.delete(10000)); //Friendly response on failure
    }
}