//----DICE----
//Compute complex dice calculations!

//Imports
const rollLib = require( 'roll' );
const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );

const { primary } = require( '../../Modules/Core/Core_config.json' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );

const roll = new rollLib();

//Functions
const data = new SlashCommandBuilder()
    .setName( 'dice' )
    .setDescription( 'Compute complex dice calculations!' )
    .addSubcommand( s => s
        .setName( 'encounter' )
        .setDescription( 'Generate ONLY an counter type.' ) )
    .addSubcommand( s => s
        .setName( 'calculate' )
        .setDescription( 'Perform a dice calculation' )
        .addStringOption( o => o
            .setName( 'calculation' )
            .setDescription( 'The die calculation to be performed (d20, d6+5, d10+d4) OR the word `encounter`.' )
            .setRequired( true ) )
    );

function run( fishsticks, int ) {

    const subCMD = int.options.getSubcommand();

    //Check for encounter generator
    if ( subCMD === 'encounter' ) {
        return int.reply( { content: 'Encounter type: ' + genEncounter() } );
    }

    //Command Breakup
    const dieRoll = int.options.getString( 'calculation' );
    const diceRolled = dieRoll.split( '+' );

    //Validate
    const valid = roll.validate( dieRoll );

    if ( !valid ) {
        return int.reply( { content: 'That doesnt look like a valid roll, hit me again.', ephemeral: true } );
    }

    //Handle Roll(s)
    const rollResult = roll.roll( dieRoll );
    let diceRolls = '', dieCalcs = '';

    for ( let t = rollResult.calculations.length - 1; t > -1; t-- ) {
        dieCalcs = dieCalcs.concat( `${rollResult.calculations[t]}\n` );
    }

    for ( const dieRollResult in rollResult.rolled ) {
        let rollNumbers = '';

        for ( const dieRollResult2 in rollResult.rolled[dieRollResult] ) {

            rollNumbers = rollNumbers.concat( `${rollResult.rolled[dieRollResult][dieRollResult2]}, ` );
        }

        diceRolls = diceRolls.concat( `**${diceRolled[dieRollResult]}**: ${rollNumbers}\n` );
    }

    if ( diceRolled.length === 1 ) {
        diceRolls = `**${diceRolled[0]}**: ${rollResult.rolled}`;
    }

    //Build embed
	const rollPanel = {
		title: '🎲 Rolling the dice 🎲',
		description: `**Total**: ${rollResult.result}`,
		footer: {
            text: `Random dice roller. Queried by ${int.member.displayName}`
        },
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

    int.reply( { embeds: [embedBuilder( rollPanel )] } );
}

function genEncounter() {
    //Calculate Yes-No-Maybe Factor
    const factor = Math.floor( Math.random() * ( 6 ) );
    const encounterTypes = ['Yes', 'Yes, but', 'Yes, and', 'Maybe', 'No', 'No, but', 'No, and'];
    return encounterTypes[factor];
}

function help() {
	return 'Performs dice calculations.';
}

//Exports
module.exports = {
    name: 'dice',
    data,
    run,
    help
};