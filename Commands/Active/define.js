//----DEFINE----
//Pull definitions from the Oxford University Dictionary

//Imports
const { dictKey, dictID } = require('../../Modules/Core/Core_keys.json');

const Dictionary = require('oxford-dictionary');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { log } = require('../../Modules/Utility/Utils_Log');

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    //Command Breakup
    const word = cmd.content[0];

    //Handle Dispatch
    const dictConf = {
        app_id: dictID,
        app_key: dictKey
    };

    const dict = new Dictionary(dictConf);
    const definitions = await getDefinitions(word, dict, cmd);

    //Build response
    let emDesc = '';
    let bullet = 1;
    for (const defItem in definitions) {
        if (defItem > 4) break;

        if (defItem == 0) {
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
        description: emDesc,
        footer: 'Powered by the Oxford University Press Dictionary API.',
        noThumbnail: true
    };

    //Send Response
    cmd.msg.channel.send({ embeds: [embedBuilder(defEmbed)] });
}

async function getDefinitions(word, dict, cmd) {
    //Process defs
    const lookup = await dict.definitions(word).catch(err => {
        if (err === 'No such entry found.') {
            cmd.msg.channel.send('No definitions were found!').then(sent => sent.delete({ timeout: 10000 }));
        }
        log('warn', '[DICT] Error ' + err);
    });

    const defs = [];
    for (const item in lookup.results) {
        for (const lexicalItem in lookup.results[item].lexicalEntries) {
            defs.push(lookup.results[item].lexicalEntries[lexicalItem].entries[0].senses[0].definitions[0]);
        }
    }

    return defs;
}

function help() {
    return 'Returns definitions for a given word.';
}