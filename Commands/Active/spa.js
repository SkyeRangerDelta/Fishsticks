// ---- IPs ----
// Displays a list of CC related game server IPs

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );
const { fso_query } = require( "../../Modules/FSO/FSO_Utils" );
const { log } = require( "../../Modules/Utility/Utils_Log" );
const { post } = require( "axios" );
const { hasPerms } = require( "../../Modules/Utility/Utils_User" );

//Globals
const data = new SlashCommandBuilder()
  .setName( 'spa' )
  .setDescription( 'Command group for SPA interaction.' );

data.addSubcommand( s => s
  .setName( 'draft-notice' )
  .setDescription( 'Drafts a new notice to be added to the official notice board.' )
  .addStringOption( o => o
    .setName( 'title' )
    .setDescription( 'Title of the notice.' )
    .setRequired( true )
  )
  .addStringOption( o => o
    .setName( 'content' )
    .setDescription( 'Content of the notice.' )
    .setRequired( true )
  )
  .addStringOption( o => o
    .setName( 'class' )
    .setDescription( 'Class of the notice.' )
    .setRequired( true )
    .addChoices(
      [
        {
          name: 'Standard (Choose this for most notices)',
          value: 'default'
        },
        {
          name: 'General Info',
          value: 'info'
        },
        {
          name: 'Warning',
          value: 'warning'
        },
        {
          name: 'Critical',
          value: 'critical'
        }
      ]
    )
  )
);

data.addSubcommand( s => s
  .setName( 'draft-record' )
  .setDescription( 'Drafts a new record for the OHR.' )
);

data.addSubcommand( s => s
  .setName( 'delete-notice' )
  .setDescription( 'Delete a notice.' )
  .addIntegerOption( o => o
    .setName( 'id' )
    .setDescription( 'ID of the notice to delete.' )
    .setRequired( true )
  )
)

//Functions
async function run( fishsticks, int ) {
  const subcommand = int.options.getSubcommand( false );

  if ( !hasPerms( int.member, ['Minecraft OP'] ) ) {
    return int.reply( {
      content: 'You do not have permission to use this command.',
      flags: MessageFlags.Ephemeral
    } );
  }

  if ( !subcommand ) {
    return int.reply( {
      content: 'This command is to be used by SPA staff only.',
      flags: MessageFlags.Ephemeral
    } );
  }

  switch ( subcommand ) {
    case 'draft-notice': {
      await int.deferReply( { flags: MessageFlags.Ephemeral } );

      const title = int.options.getString( 'title' );
      const content = int.options.getString( 'content' );
      const classType = int.options.getString( 'class' );

      const author = int.member.displayName;

      return int.editReply( await draftNotice( fishsticks, title, content, classType, author ) );
    }
    case 'draft-record': {
      return int.reply( await draftRecord() );
    }
    case 'delete-notice': {
      const id = int.options.getInteger( 'id' );

      return int.reply( await deleteNotice( id ) );
    }
    default:
      return int.reply( {
        content: 'Unknown subcommand.',
        flags: MessageFlags.Ephemeral
      } );
  }
}

async function draftNotice( fishsticks, title, content, classType, author ) {
  let response;
  let ephemeral = true;

  const API_URI = process.env.SPA_API_URI + '/PostNewNotice';
  const ADMIN_TOKEN = `${ process.env.SPA_ADMIN_TOKEN }`;

  const messageLinkUsed = false;

  // Determine if the content value is equal to a discord message link; if so, fetch the content from the linked message
  // and use that instead.
  // IE: https://discord.com/channels/125677594669481984/704876734197137439/724799927527538739
  if ( content.startsWith( 'https://discord.com/channels/' ) ) {
    const messageLink = content.split( '/' );
    const channelId = messageLink[ messageLink.length - 2 ];
    const messageId = messageLink[ messageLink.length - 1 ];

    try {
      const channel = await fishsticks.CCG.channels.fetch( channelId );
      if ( !channel ) {
        response = 'Failed to fetch the channel for the provided message link.';
        return { content: response, flags: ephemeral ? MessageFlags.Ephemeral : undefined };
      }

      const message = await channel.messages.fetch( messageId );
      if ( !message ) {
        response = 'Failed to fetch the message for the provided message link.';
        return { content: response, flags: ephemeral ? MessageFlags.Ephemeral : undefined };
      }

      content = message.content;
      log( 'info', `[SPA] Fetched content from message link: ${ content }` );
    }
    catch ( e ) {
      log( 'error', `[SPA] Failed to fetch channel: ${ e.message }` );
      response = `Failed to fetch channel: ${ e.message }`;
      return { content: response, flags: ephemeral ? MessageFlags.Ephemeral : undefined };
    }
  }

  // Parse the content here for hotstring character sets. If any are found, replace them with their proper characters.
  const editedContent = messageLinkUsed ? content : content.replace(/\\n/g, '\n').replace(/\\t/g, '\t');

  let noticeObject = {
    title: title,
    content: editedContent,
    class: classType,
    author: author
  };

  let res;
  try {
    res = await post(
      API_URI,
      noticeObject,
      {
        headers: {
          'User-Agent': 'Fishsticks',
          'x-admin-token': ADMIN_TOKEN
        }
      }
    )

    if ( res.status === 200 ) {
      response = `Successfully drafted notice titled "${ title }". It will be reviewed by SPA staff shortly.`;
    }
    else {
      log( 'error', `[SPA] Failed to draft notice: ${ res.status } - ${ res.statusText }` );
      response = `Failed to draft notice: ${ res.status } - ${ res.statusText }`;
    }
  }
  catch ( e ) {
    if ( e.response ) {
      log( 'error', `[SPA] Failed to draft notice: ${ e.response.status } - ${ e.response.statusText }` );
      response = `Failed to draft notice: ${ e.response.status } - ${ e.response.statusText }`;
    }
    else {
      log( 'error', `[SPA] Failed to draft notice: ${ e.message }` );
      response = `Failed to draft notice: ${ e.message }`;
    }
  }

  return {
    content: response,
    flags: ephemeral ? MessageFlags.Ephemeral : undefined
  }
}

async function draftRecord() {
  let response = 'This command is not yet implemented.';
  let ephemeral = true;



  return {
    content: response,
    flags: ephemeral ? MessageFlags.Ephemeral : undefined
  }
}

async function deleteNotice( id ) {
  let response = 'Deleting notices is not yet implemented.';
  let ephemeral = true;



  return {
    content: response,
    flags: ephemeral ? MessageFlags.Ephemeral : undefined
  }
}

function help() {
  return 'Performs various SPA related tasks.';
}

//Exports
module.exports = {
  name: 'spa',
  data,
  run,
  help
};