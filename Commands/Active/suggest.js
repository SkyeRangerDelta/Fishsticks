// ----SUGGEST----
// Posts an issue to the Fs GitHub via Webhook

//Imports
const https = require('https');

const { fsSuggestionHook } = require('../../Modules/Core/Core_keys.json');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');

const { log } = require('../../Modules/Utility/Utils_Log');

//Exports
module.exports = {
    run,
    help
};

async function run(fishsticks, cmd) {
    cmd.msg.delete();

    //Syntax: !suggest -title -body
    let hookURL = fsSuggestionHook.concat(`?sender=${cmd.msg.author.username}&suggTitle=${cmd.content[0]}&suggBody=${cmd.content[1]}`);
    hookURL = encodeURI(hookURL);

    //Attempt suggestion send
    log('info', '[SUGGEST] Dispatching a request.');
    https.get(hookURL, (res) => {
        log('info', '[SUGGEST] Status: ' + res.statusCode);
    }).on('error', (eventGetError) => {
        console.log(eventGetError);
    });

    //FSO Sync Suggestions
    log('info', '[SUGGEST] Syncing member suggestions');

    const currMemberData = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: cmd.msg.author.id });

    const updateData = {
        $inc: {
            suggestionsPosted: 1
        }
    };

    const updatedMember = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', updateData, { id: cmd.msg.author.id });

    if (updatedMember.modifiedCount === 1) {
        log('proc', '[SUGGEST] Synced.');
    }
    else {
        return cmd.reply('Something went wrong. Ask Skye to investigate.');
    }
}

function help() {
    return 'Posts a GitHub issue to the Fishsticks repository.';
}