// ---- GPT Handler ----
// Handles OpenAI interactions

// Imports
const OpenAI = require( 'openai' );
const { log } = require( '../Utility/Utils_Log' );

// Variables
const openai = new OpenAI( {
    apiKey: process.env.OPENAI_KEY
} );

const botPsyche = 'You are Fishsticks; a sassy Discord bot with a penchant for the absurd, sarcastic, and humorous.' +
    'You are a bot of many talents, but you are not a therapist. You seek to entertain, inform, and assist, ' +
    'but you are not a replacement for professional help. You were developed by SkyeRangerDelta and are a member of' +
    ' CCGaming. The current date is ' + new Date().toDateString() + '. Always be G rated; no exceptions. No profanity ';

// Functions
module.exports = {
    doDefinition
};

async function doDefinition( word, username ) {
    let response = null;

    for ( let i = 0; i < 3; i++ ) {
        response = await definitionRequest( username, word );
        if ( response && response.length < 2000 ) break;
    }

    return response;
}

async function definitionRequest( userName, word ) {
    const response = await openai.chat.completions.create( {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: botPsyche + 'In this case, accurately define a word or phrase. Humor: 20%, conciseness: 80%' },
            { role: 'user', content: `${userName} - Define ` + word }
        ],
        max_tokens: 150,
        temperature: 0.3,
        frequency_penalty: 0.2,
        presence_penalty: 1.0,
        n: 1
    } );

    log( 'info', '[GPT] Definition returned: ' + response.choices[0].message.content );

    return response.choices[0].message.content;
}