// ---- MC Operator ----
// Enables Minecraft Operator command functions.

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
// const { AMPAPI } = require( '@cubecoders/ampapi' );
const { hasPerms } = require( '../../Modules/Utility/Utils_User' );

//Globals
const data = new SlashCommandBuilder()
  .setName( 'mc-operator' )
  .setDescription( 'Enables Minecraft Operator command functions.' );

data.addSubcommand( s => s
  .setName( 'say' )
  .setDescription( 'Sends a message to the server console.' )
  .addStringOption( o => o
    .setName( 'message' )
    .setDescription( 'The message to send to the server console.' )
    .setRequired( true )
  )
);

data.addSubcommand( s => s
  .setName( 'whitelist-add' )
  .setDescription( 'Adds a user to the whitelist.' )
  .addStringOption( o => o
    .setName( 'username' )
    .setDescription( 'The username to add to the whitelist.' )
    .setRequired( true )
  )
);

data.addSubcommand( s => s
  .setName( 'whitelist-remove' )
  .setDescription( 'Removes a user from the whitelist.' )
  .addStringOption( o => o
    .setName( 'username' )
    .setDescription( 'The username to remove from the whitelist.' )
    .setRequired( true )
  )
);

//Functions
async function run( fishsticks, int ) {
  await int.deferReply( { ephemeral: true } );

  if ( !hasPerms( int.member, [ 'Minecraft OP' ] ) ) {
    return int.editReply( { content: 'You do not have permission to use this command.' } );
  }

  const subcommand = int.options.getSubcommand();
  console.info( `MC Operator: ${ subcommand }` );
  // const instanceID = subcommand === 'whitelist-add' || subcommand === 'whitelist-remove' ?
  //   process.env.CCCRAFT_NODE_CONTROLLER_ID :
  //   process.env.CCCRAFT_INSTANCE_ID;

  // const ampUri = `${ process.env.AMP_URL_CORE }${process.env.AMP_INSTANCE_PATH}${ instanceID }`;

  // WARN: AMP API depends on vulnerable deps
  // TODO: Implement an alternative to @cubecoders/ampapi
  // const AMP_API = new AMPAPI( `${ ampUri }` );

  // Authenticate with AMP
  /*
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

    // Do Thing
    console.info( 'Sending command...' );
    if ( !AMP_API ) return int.editReply( { content: 'AMP API is not ready!' } );

    if ( subcommand === 'say' ) {
      await AMP_API.Core.SendConsoleMessageAsync( `say ${ int.options.getString( 'message' ) }` );
      return int.editReply( { content: 'Message sent.' } );
    }
    else if ( subcommand === 'whitelist-add' ) {
      await AMP_API.Core.SendConsoleMessageAsync( `whitelist add ${ int.options.getString( 'username' ) }` );
      return int.editReply( { content: 'User added to whitelist.' } );
    }
    else if ( subcommand === 'whitelist-remove' ) {
      await AMP_API.Core.SendConsoleMessageAsync( `whitelist remove ${ int.options.getString( 'username' ) }` );
      return int.editReply( { content: 'User removed from whitelist.' } );
    }
    else {
      return int.editReply( { content: 'Invalid subcommand.' } );
    }

  } catch {
    return int.editReply( { content: 'Failed to authenticate with AMP.' } );
  }

   */

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