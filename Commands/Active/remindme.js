//----Remind Me----
// Sets a time out for pinging someone with a message

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'remindme' )
    .setDescription( 'Pings you with a message some amount of time later.' )
    .addIntegerOption( o => o
        .setName( 'wait-time' )
        .setDescription( 'The time in minutes to wait before sending the reminder.' )
        .setRequired( true ) )
    .addStringOption( o => o
        .setName( 'reminder-text' )
        .setDescription( 'The actual reminder to ping you with.' )
        .setRequired( true )
    );

//Functions
function run( fishsticks, int ) {

    //Syntax: /remindme time message

    const rawTime = int.options.getInteger( 'wait-time' );
    const waitTime = rawTime * 1000 * 60;

    int.reply( { content: `Very good, I'll come find you in ${rawTime} minutes.`, flags: MessageFlags.Ephemeral } );

    setTimeout( function() {
        int.channel.send( { content: `${int.member}, The time is now!\n${int.options.getString( 'reminder-text' )}` } );
    }, waitTime );
}

function help() {
    return 'Pings you with a given message after the set amount of time passes.';
}

//Exports
module.exports = {
    name: 'remindme',
    data,
    run,
    help
};