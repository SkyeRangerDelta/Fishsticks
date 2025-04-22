//----DEFINE----
//Pull definitions from the Oxford University Dictionary

//Imports
const { SlashCommandBuilder } = require( '@discordjs/builders' );

const { doDefinition } = require( '../../Modules/Core/Core_GPT' );

//Functions
const data = new SlashCommandBuilder()
    .setName( 'define' )
    .setDescription( 'Pulls definitions for words from the Oxford University Dictionary.' );

data.addStringOption( o => o.setName( 'word' ).setDescription( 'The word to define.' ).setRequired( true ) );

async function run( fishticks, int ) {
    await int.channel.sendTyping();
    int.deferReply();

    const input = int.options.getString( 'word' ).split( ' ' );

    //Command Breakup
    const term = !input[1] ? input[0] : input[0] + ' ' + input[1];
    const word = term.toLowerCase();

    const def = await doDefinition( word, int.user.displayName );

    //Send Response
    await int.editReply( { content: `[*Defining \`${word}\`*]\n` + def } );
}

function help() {
    return 'Returns definitions for a given word.';
}

//Exports
module.exports = {
    name: 'define',
    data,
    run,
    help
};