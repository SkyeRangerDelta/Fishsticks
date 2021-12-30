//----DICE----
//Compute complex dice calculations!

//Imports
const rollLib = require('roll');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

const { primary } = require('../../Modules/Core/Core_config.json');

const roll = new rollLib();

//Exports
module.exports = {
	run,
	help
};

//Functions
function run(fishsticks, cmd) {
    cmd.msg.delete();

    //Validate
    if (!cmd.content[0]) {
        return cmd.reply('Specify a die type or calculation!', 10);
    }

    //Command Breakup
    const dieRoll = cmd.content[0];
    const diceRolled = cmd.content[0].split('+');

    //Check for encounter generator
    if (cmd.content[0].toLowerCase() === 'encounter') {
        return cmd.channel.send('Encounter type: ' + genEncounter());
    }

    //Validate
    const valid = roll.validate(dieRoll);

    if (!valid) {
        return cmd.reply('That doesnt look like a valid roll, hit me again.', 10);
    }

    //Handle Roll(s)
    const rollResult = roll.roll(dieRoll);
    let diceRolls = '', dieCalcs = '';

    for (let t = rollResult.calculations.length - 1; t > -1; t--) {
        dieCalcs = dieCalcs.concat(`${rollResult.calculations[t]}\n`);
    }

    for (const dieRollResult in rollResult.rolled) {
        let rollNumbers = '';

        for (const dieRollResult2 in rollResult.rolled[dieRollResult]) {

            rollNumbers = rollNumbers.concat(`${rollResult.rolled[dieRollResult][dieRollResult2]}, `);
        }

        diceRolls = diceRolls.concat(`**${diceRolled[dieRollResult]}**: ${rollNumbers}\n`);
    }

    if (diceRolled.length === 1) {
        diceRolls = `**${diceRolled[0]}**: ${rollResult.rolled}`;
    }

    //Build embed
	const rollPanel = {
		title: '🎲 Rolling the dice 🎲',
		description: `**Total**: ${rollResult.result}`,
		footer: `Random dice roller. Queried by ${cmd.msg.author.username}`,
		color: primary,
		fields: [
			{
				name: 'Dice Rolls',
				value: diceRolls,
				inline: true
			},
			{
				name: 'Encounter Type',
				value: genEncounter(),
				inline: true
			},
			{
				name: 'Calculations',
				value: dieCalcs,
				inline: true
			}
		]
	};

    cmd.channel.send({ embeds: [embedBuilder(rollPanel)] });
}

function genEncounter() {
    //Calculate Yes-No-Maybe Factor
    const factor = Math.floor(Math.random() * (6));
    const encounterTypes = ['Yes', 'Yes, but', 'Yes, and', 'Maybe', 'No', 'No, but', 'No, and'];
    return encounterTypes[factor];
}

function help() {
	return 'Performs dice calculations.';
}