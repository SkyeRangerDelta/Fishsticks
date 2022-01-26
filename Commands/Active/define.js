//----DEFINE----
//Pull definitions from the Oxford University Dictionary

//Imports
const { dictKey, dictID } = require('../../Modules/Core/Core_keys.json');

const Dictionary = require('oxford-dictionary');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { log } = require('../../Modules/Utility/Utils_Log');
const { SlashCommandBuilder } = require('@discordjs/builders');

//Functions
const data = new SlashCommandBuilder()
    .setName('define')
    .setDescription('Pulls definitions for words from the Oxford University Dictionary.');

data.addStringOption(o => o.setName('word').setDescription('The word to define.').setRequired(true));

async function run(fishticks, int) {

    //Command Breakup
    const word = int.options.getString('word');

    //Handle Dispatch
    const dictConf = {
        app_id: dictID,
        app_key: dictKey
    };

    const dict = new Dictionary(dictConf);
    const definitions = await getDefinitions(word, dict);

    //Build response
    let emDesc = 'Definitions:\n';
    let bullet = 1;
    for (const defItem in definitions) {
        if (defItem > 4) break;

        if (defItem === 0) {
            emDesc = emDesc.concat('**' + bullet + '. ' + definitions[defItem] + '**\n');
            bullet++;
        }
        else {
            emDesc = emDesc.concat(bullet + '. ' + definitions[defItem] + '\n');
            bullet++;
        }
    }

    const defEmbed = {
        title: 'o0o - Dictionary [' + word + '] - o0o',
        description: `${ emDesc }`,
        footer: 'Powered by the Oxford University Press Dictionary API.',
        noThumbnail: true
    };

    //Send Response
    int.reply({ embeds: [embedBuilder(defEmbed)] });
}

async function getDefinitions(word, dict) {
    //Process defs
    const defs = [];

    const lookup = await dict.definitions(word).catch(err => {
        log('warn', '[DICT] Error: ' + err);
        if (err === 'No such entry found.') {
            defs.push('None found!');
        }

        return defs;
    });

    for (const item in lookup.results) {
        for (const lexicalItem in lookup.results[item].lexicalEntries) {
            defs.push(lookup.results[item].lexicalEntries[lexicalItem].entries[0].senses[0].definitions[0]);
        }
    }

    console.log(defs);

    return defs;
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