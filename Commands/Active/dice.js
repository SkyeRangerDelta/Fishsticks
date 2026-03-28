//----DICE----
//Compute complex dice calculations!

//Imports
const { validate, roll } = require( '../../Modules/Utility/Utils_Dice' );
const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );

const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );

const { getErrorResponse } = require( '../../Modules/Core/Core_GPT' );

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

async function run( fishsticks, int ) {

  const subCMD = int.options.getSubcommand();

  //Check for encounter generator
  if ( subCMD === 'encounter' ) {
    return int.reply( { content: 'Encounter type: ' + genEncounter() } );
  }

  //Command Breakup
  const dieRoll = int.options.getString( 'calculation' ).replace( /\s/g, '' ).replace( /,/g, '+' );
  const diceRolled = dieRoll.match( /\d*d(?:\d+|%)(?:[bw]\d+)?/g ) || [];

  //Validate
  const valid = validate( dieRoll );

  if ( !valid ) {
    return int.reply( {
      content: `${ await getErrorResponse( int.client.user.displayName, 'dice roll', 'the command said it was invalid.' ) }`,
      flags: MessageFlags.Ephemeral
    } );
  }

  //Handle Roll(s)
  const rollResult = roll( dieRoll );
  const isMultiGroup = diceRolled.length > 1;

  //Build breakdown - step-by-step with dice rolls and modifiers
  const segments = dieRoll.split( /(?=[+\-])/ );
  let diceIdx = 0;
  let breakdown = '';

  for ( const seg of segments ) {
    const hasOp = /^[+\-]/.test( seg );
    const op = hasOp ? seg[0] : '';
    const cleanSeg = hasOp ? seg.substring( 1 ) : seg;

    if ( cleanSeg.includes( 'd' ) ) {
      const label = diceRolled[diceIdx] || cleanSeg;
      const rolls = isMultiGroup ? rollResult.rolled[diceIdx] : rollResult.rolled;
      breakdown += `🎲 ${op ? op + ' ' : ''}**${label}** → [${rolls.join( ', ' )}]\n`;
      diceIdx++;
    }
    else {
      breakdown += `${op === '-' ? '▻ -' : '▻ +'}${cleanSeg}\n`;
    }
  }

  //Build embed
  const rollPanel = {
    title: '🎲 Dice Roll',
    description: `\`${dieRoll}\`\n### Total: ${rollResult.result}`,
    footer: {
      text: `Queried by ${ int.member.displayName }`
    },
    color: fishsticks.CONFIG.colors.primary,
    fields: [
      {
        name: 'Breakdown',
        value: breakdown,
        inline: true
      },
      {
        name: 'Encounter',
        value: genEncounter(),
        inline: true
      }
    ]
  };

  int.reply( { embeds: [ embedBuilder( fishsticks, rollPanel ) ] } );
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