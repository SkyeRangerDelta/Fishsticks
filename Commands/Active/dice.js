//----DICE----

//LIBRARIES
const rollLib = require('roll');
const Discord = require('discord.js');

//CONFIGS
const fsconfig = require('../../Modules/Core/corecfg.json');

//GLOBALS
let roll = new rollLib();

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //Command Breakup
    let cmdArgs = msg.content.toLowerCase().split(' ');
    let dieRoll = cmdArgs[1];
    let diceRolled = cmdArgs[1].split('+');

    //Check for encounter generator
    if (cmd[0].toLowerCase() == "encounter") {
        return msg.channel.send("Encounter type: " + genEncounter());
    }

    //Validate
    let valid = roll.validate(dieRoll);

    if (!valid) {
        return msg.reply("That doesn't look like a valid roll, hit me again.").then(sent => sent.delete(10000));
    }

    //Handle Roll(s)
    let rollResult = roll.roll(dieRoll);
    let diceRolls = "", dieCalcs = "";

    console.log(rollResult);

    for (let t = rollResult.calculations.length - 1; t > -1; t--) {
        dieCalcs = dieCalcs.concat(`${rollResult.calculations[t]}\n`);
    }

    for (dieRollResult in rollResult.rolled) {
        let rollNumbers = "";
        
        for (dieRollResult2 in rollResult.rolled[dieRollResult]) {

            rollNumbers = rollNumbers.concat(`${rollResult.rolled[dieRollResult][dieRollResult2]}, `);
        }

        diceRolls = diceRolls.concat(`**${diceRolled[dieRollResult]}**: ${rollNumbers}\n`);
    }

    if (diceRolled.length == 1) {
        diceRolls = `**${diceRolled[0]}**: ${rollResult.rolled}`;
    }

    //Build embed
    let rollPanel = new Discord.RichEmbed();
        rollPanel.setTitle("🎲 Rolling the dice 🎲");
        rollPanel.setColor(fsconfig.fscolor);
        rollPanel.setFooter(`Random dice roller. Queried by ${msg.author.username}`);
        rollPanel.setDescription(`**Total**: ${rollResult.result}`);
        rollPanel.addField("Dice Rolls:", diceRolls, true);
        rollPanel.addField("Encounter Type:", genEncounter(), true);
        rollPanel.addField("Calculations:", dieCalcs, true);

    msg.channel.send({embed: rollPanel});
}

function genEncounter() {
    //Calculate Yes-No-Maybe Factor
    let factor = Math.floor(Math.random() * (6 - 0)) + 0;
    let encounterTypes = ["Yes", "Yes, but", "Yes, and", "Maybe", "No", "No, but", "No, and"];
    let factorResult = encounterTypes[factor];

    return factorResult;
}