// ---- Boot Routine ----

//Imports
const { log } = require( '../Utility/Utils_Log' );

const { fso_connect, fso_query, buildEntitiesObject, getConfigData } = require( '../FSO/FSO_Utils' );
const { convertMsFull, systemTimestamp } = require( '../Utility/Utils_Time' );
const { embedBuilder } = require( '../Utility/Utils_EmbedBuilder' );
const { terminate } = require( '../Utility/Utils_Terminate' );

const fs = require( 'fs' );
const { execSync } = require( 'child_process' );
const path = require( 'path' );
const { REST } = require( '@discordjs/rest' );
const { Routes, ActivityType } = require( 'discord-api-types/v9' );
const axios = require( "axios" );
const { sign } = require( "jsonwebtoken" );

//Exports
module.exports = {
  startUp
};

//Functions
async function startUp( Fishsticks ) {

  const token = process.env.TOKEN;
  const version = getVersion();

  if ( !token ) {
    log( 'err', '[FISHSTICKS] [FATAL] Fishsticks could not be started! No token was found!' );
    await Fishsticks.CONSOLE.send( `${Fishsticks.RANGER}, Fishsticks could not be started! No token was found!` );
    return terminate( Fishsticks );
  }

  //Test launch args
  if ( process.argv.length > 2 ) {
    log( 'warn', '[FISHSTICKS] FS was launched with at least one command line argument.' );

    for ( const arg in process.argv ) {
      if ( process.argv[arg] === '-test' ) {
        Fishsticks.TESTMODE = true;
      }

      Fishsticks.NODEARGS.push( process.argv[arg] );
    }
  }

  // -- Perform startup routine --
  //FSO Connection
  try {
    log( 'info', '[FSO] Attempting to connect to FSO...' );
    Fishsticks.FSO_CONNECTION = await fso_connect();

    //Before FSO syncs begin - conduct a DB validation
    /*
    try {
      Fishsticks.FSO_VALID = await fso_verify(Fishsticks.FSO_CONNECTION);
    }
    catch (e) {
      throw new fsProcessException('FSO validation could not be completed.\n' + e);
    }
    finally {
      Fishsticks.FSO_STATE = await fso_status(Fishsticks.FSO_CONNECTION);
    }
    */
  }
  catch ( error ) {
    if ( error.name === 'MongoServerSelectionError' ) {
      log( 'err', '[FSO] [FATAL] FSO could not be reached!.\n' + error );
      await Fishsticks.CONSOLE.send( `${Fishsticks.RANGER}, FSO connection failed, check the server and subroutine config.` );
      return terminate( Fishsticks );
    }
    else {
      log( 'err', '[FSO] Something has gone wrong in the startup routine.\n' + error );
    }
  }

  const timestamp = new Date();
  const timeNow = Date.now();

  //Sync FSO Status
  const statusPreUpdate = await fso_query( Fishsticks.FSO_CONNECTION, 'FSO_Status', 'select', { id: 1 } );

  Fishsticks.session = ++statusPreUpdate.Session;
  Fishsticks.lastSystemStart = convertMsFull( statusPreUpdate.StartupTime - timeNow );
  Fishsticks.DOCKET_PIN = statusPreUpdate.docketPinID || 0;

  const filterDoc = {
    id: 1
  };
  const statusTableUpdate = {
    $set: {
      Online: true,
      Session: Fishsticks.session,
      StartupTime: systemTimestamp(),
      StartupUTC: timeNow
    }
  };

  const statusPostUpdate = await fso_query( Fishsticks.FSO_CONNECTION, 'FSO_Status', 'update', statusTableUpdate, filterDoc );

  if ( statusPostUpdate.modifiedCount !== 1 ) {
    log( 'warn', '[FSO] Status table update failed. Record update count was not expected.' );
  }
  else {
    log ( 'info', '[FSO] Status table update done.' );
  }

  //Init Objs
  await buildEntitiesObject( Fishsticks );
  await getConfigData( Fishsticks );

  Fishsticks.CCG = await Fishsticks.guilds.cache.get( `${ Fishsticks.ENTITIES.CCG }` );

  //Cache all members for ROLE-SYS checks
  Fishsticks.CCG.members.fetch();

  Fishsticks.CONSOLE = await Fishsticks.CCG.channels.cache.get( `${ Fishsticks.ENTITIES.Channels[ 'fishsticks-console' ] }` );
  Fishsticks.BOT_LOG = await Fishsticks.CCG.channels.cache.get( `${ Fishsticks.ENTITIES.Channels[ 'bot-logger' ] }` );
  Fishsticks.RANGER = await Fishsticks.CCG.members.cache.get( `${ Fishsticks.ENTITIES.Users[ 'skyerangerdelta' ] }` );
  Fishsticks.MEMBER = await Fishsticks.CCG.members.cache.get( `${ Fishsticks.ENTITIES.Users[ 'Fishsticks' ] }` );

  //Console confirmation
  log( 'proc', '[CLIENT] Fishsticks is out of the oven.\n-------------------------------------------------------' );

  // Register slash commands
  const commandObjs = [];
  const globalCmdObjs = [];
  const cmdPath = path.join( __dirname, '../..', 'Commands/Active' );
  const commandData = fs.readdirSync( cmdPath ).filter( f => f.endsWith( '.js' ) );

  for ( const cmdFile of commandData ) {
    try {
      const cmd = require( `../../Commands/Active/${cmdFile}` );

      //Register commands separately.
      if ( cmd.global ) {
        globalCmdObjs.push( cmd.data.toJSON() );
      }
      else {
        commandObjs.push( cmd.data.toJSON() );
      }

      Fishsticks.CMDS.set( cmd.data.name, cmd );
    }
    catch ( e ) {
      console.error( 'Got a mess here.', e );
    }
  }

  log( 'proc', '[CMD-HANDLER] Beginning command registration' );
  const rest = new REST( { version: 9 } ).setToken( token );
  try {

    log( 'proc', '[CMD-HANDLER] Doing global registration...' );
    await rest.put(
      Routes.applicationCommands(
        `${ Fishsticks.MEMBER.id }`
      ),
      { body: globalCmdObjs }
    );

    log( 'proc', '[CMD-HANDLER] Doing guild registration' );
    await rest.put(
      Routes.applicationGuildCommands(
        `${ Fishsticks.MEMBER.id }`,
        `${ Fishsticks.CCG.id }`
      ),
      { body: commandObjs }
    );

    log( 'proc', '[CMD-HANDLER] Finished registering commands' );
  }
  catch ( e ) {
    console.log( e );
    log( 'err', '[CMD-HANDLER] Failed to finished registering commands!' );
    Fishsticks.destroy();
    process.exit( 1 );
  }

  //Cache data
  // - Poll messages
  try {
    const polls = await fso_query( Fishsticks.FSO_CONNECTION, 'FSO_Polls', 'selectAll' );
    for ( const poll in polls ) {
      const ch = await Fishsticks.channels.cache.get( polls[poll].chId );
      await ch.messages.fetch( polls[poll].intId );
      Fishsticks.pollCache++;
    }
  }
  finally {
    log( 'proc', `[POLL] Cached all ${Fishsticks.pollCache} polls successfully.` );
  }

  //Dispatch Startup Message
  if ( Fishsticks.TESTMODE ) {
    log( 'warn', '[FISHSTICKS] Fs has been booted into Test mode!' );

    const startupEmbed = {
      title: 'Test Mode Boot',
      description: version + ' feels undercooked. Test mode time.',
      color: Fishsticks.CONFIG.colors.emergency,
      noThumbnail: true,
      footer: {
        text: 'Sequence initiated at ' + systemTimestamp( timestamp )
      },
      fields: [
        {
          name: 'Last startup time',
          value: statusPreUpdate.StartupTime,
          inline: true
        }
      ]
    };

    Fishsticks.CONSOLE.send( { embeds: [ embedBuilder( Fishsticks, startupEmbed ) ] } );
  }
  else {
    const startupMessage = {
      title: 'o0o - Fishsticks Startup - o0o',
      description: 'Dipping in flour...\nBaking at 400°...\nFishticks ' + version + ' is ready to go!',
      color: Fishsticks.CONFIG.colors.primary,
      footer: {
        text: 'Sequence initiated at ' + systemTimestamp( timestamp )
      },
      fields: [
        {
          name: 'Last startup time',
          value: statusPreUpdate.StartupTime,
          inline: true
        },
        {
          name: 'Time since last startup',
          value: convertMsFull( statusPreUpdate.StartupUTC - timeNow ),
          inline: true
        }
      ]
    };

    const startupEmbed = embedBuilder( Fishsticks, startupMessage );
    Fishsticks.CONSOLE.send( { embeds: [startupEmbed] } );
  }

  startRotatingStatuses( Fishsticks );

  //Startup Complete
  log( 'proc', '[CLIENT] Fishsticks is ready to run.\n-------------------------------------------------------' );

}

function getVersion() {
  return execSync( 'git describe --tags --always', { encoding: 'utf8' } ).trim();
}

async function startRotatingStatuses( Fishsticks, testMode = false ) {
  log( 'info', '[FISHSTICKS] Starting rotating status messages.' );

  const statuses = await fso_query( Fishsticks.FSO_CONNECTION, 'FSO_StatusMessages', 'selectAll' );

  if ( !statuses || statuses.length === 0 ) {
    statuses.push( { name: 'for /help', type: 'watching' } );
  }
  else {
    log( 'proc', `[FISHSTICKS] Found ${statuses.length} rotating statuses.` );
  }

  setInterval( () => {
    let cType;
    let i = Math.floor( Math.random() * statuses.length );

    switch ( statuses[ i ].type ) {
      case 'playing':
        cType = ActivityType.Playing;
        break;
      case 'listening':
        cType = ActivityType.Listening;
        break;
      case 'watching':
        cType = ActivityType.Watching;
        break;
      case 'competing':
        cType = ActivityType.Competing;
        break;
      default:
        cType = ActivityType.Custom;
    }

    Fishsticks.user.setPresence( {
      activities: [{ name: testMode ? `${ statuses[i].name } | TEST MODE` : statuses[i].name, type: cType }],
      status: testMode ? 'away' : 'online'
    } );
  }, 180000 );
}