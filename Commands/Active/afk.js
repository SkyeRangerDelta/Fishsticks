//----AFK----
//Renames the AFK voice chat

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );

//Functions
const data = new SlashCommandBuilder()
  .setName( 'afk' )
  .setDescription( 'Changes the name of the AFK channel.' );

data.addStringOption( s => s.setName( 'a-starting-word' ).setDescription( 'Word that starts with A.' ).setRequired( true ) );
data.addStringOption( s => s.setName( 'f-starting-word' ).setDescription( 'Word that starts with F.' ).setRequired( true ) );
data.addStringOption( s => s.setName( 'k-starting-word' ).setDescription( 'Word that starts with K.' ).setRequired( true ) );

async function run( fishsticks, int ) {
  let newName = '';

  const a = int.options.getString( 'a-starting-word' ).toLowerCase();
  const f = int.options.getString( 'f-starting-word' ).toLowerCase();
  const k = int.options.getString( 'k-starting-word' ).toLowerCase();

  if ( a.charAt( 0 ) !== 'a' ) {
    return int.reply( { content: '(A)FK - The word needs to start with an A!', flags: MessageFlags.Ephemeral } );
	}
	else if ( f.charAt( 0 ) !== 'f' ) {
    return int.reply( { content: 'A(F)K - The word needs to start with an F!', flags: MessageFlags.Ephemeral } );
	}
	else if ( k.charAt( 0 ) !== 'k' ) {
    return int.reply( { content: 'AF(K) - The word needs to start with a K!', flags: MessageFlags.Ephemeral } );
  }

  newName = `AFK (${a} ${f} ${k})`;

  const AFKChannel = await fishsticks.CCG.channels.cache.get(fishsticks.ENTITIES.Channels[ 'afk' ]);

  AFKChannel.setName( newName, 'The AFK command was used!' )
      .then( int.reply( { content: 'Done!', flags: MessageFlags.Ephemeral } ) );
}

function help() {
    return 'Changes the AFK channel name';
}

//Exports
module.exports = {
    name: 'afk',
    data,
    run,
    help
};