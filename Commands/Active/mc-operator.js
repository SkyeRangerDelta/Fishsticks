// ---- MC Operator ----
// Enables Minecraft Operator command functions.

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { AMPAPI } = require( '@cubecoders/ampapi' );
const { hasPerms } = require( '../../Modules/Utility/Utils_User' );

//Globals
const data = new SlashCommandBuilder()
  .setName( 'mc-operator' )
  .setDescription( 'Enables Minecraft Operator command functions.' );

data.addStringOption( o => o
  .setName( 'message' )
  .setDescription( 'The message to send to the server console.' )
  .setRequired( true )
);

const ampUri = `${ process.env.AMP_URL_CORE }${process.env.AMP_INSTANCE_PATH}${ process.env.CCCRAFT_INSTANCE_ID }`;

//Functions
async function run( fishsticks, int ) {
  await int.deferReply( { ephemeral: true } );

  if ( !hasPerms( int.member, [ 'Minecraft OP' ] ) ) {
    return int.editReply( { content: 'You do not have permission to use this command.' } );
  }

  const AMP_API = new AMPAPI( `${ ampUri }` );

  // Authenticate with AMP
  try {
    console.info( 'Initializing AMP...' );
    let apiInit = await AMP_API.initAsync();
    if ( !apiInit ) {
      return int.editReply( { content: 'Failed to initialize AMP (phase 1).' } );
    }

    console.log( 'Authenticating with AMP...' );
    const apiLogin = await AMP_API.Core.LoginAsync( process.env.AMP_USER, process.env.AMP_PASS, '', false );
    if ( apiLogin.success ) {
      console.info( 'AMP Authenticated.' );
      AMP_API.sessionId = apiLogin.sessionID;

      // Redo init now that we're authed
      console.info( 'Reinitializing' );
      apiInit = await AMP_API.initAsync();
      if ( !apiInit ) {
        return int.editReply( { content: 'Failed to initialize AMP (phase 2).' } );
      }
    }
    else {
      return int.editReply( { content: 'Something broke with AMP.' } );
    }

    // Do test
    console.info( 'Sending test command...' );
    if ( !AMP_API ) return int.editReply( { content: 'AMP API is not ready!' } );
    await AMP_API.Core.SendConsoleMessageAsync( `say ${ int.options.getString( 'message' ) }` );

  } catch {
    return int.editReply( { content: 'Failed to authenticate with AMP.' } );
  }

  // Determine and execute functions
}

function help() {
  return 'Lists official CC game server IP addresses.';
}

//Exports
module.exports = {
  name: 'mc-operator',
  data,
  run,
  help
};