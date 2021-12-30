// ---- Prayer ----
// Like the docket but for prayer meetings

//Imports
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

const fs = require('fs');

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {
    await cmd.msg.delete();

    //Syntax
    //!prayer: lists prayer requests
    //!prayer -[stuff]: add stuff to list
    //!prayer -clear: clears stuff

    if (!cmd.content[0]) {
        //List
        return showList(cmd);
    }
    else if (cmd.content[0] === 'clear') {
        //Clear
        return clearList(cmd);
    }
    else if (cmd.content[0]) {
        //Add
        return addToList(cmd);
    }
}

function help() {
    return 'Like the docket, but for Prayer Meetings.';
}

function showList(cmd) {
    const pReqDataFile = JSON.parse(fs.readFileSync('./Modules/Library/prayerReqs.json', 'utf8'));

    const listEmbed = {
        title: 'o0o - Prayer Requests - o0o',
        description: 'Prayer Requests gathered throughout the week.',
        footer: 'Prayer Requests.',
        delete: 75000,
        noThumbnail: true,
        fields: pReqDataFile.pReqs
    };

    return cmd.channel.send({ content: 'Prayer Request List.', embeds: [embedBuilder(listEmbed)] })
        .then(sent => {
            setTimeout(() => sent.delete(), 25000);
        });
}

function addToList(cmd) {
    const pReq = {
        name: `${cmd.msg.member.displayName}`,
        value: cmd.content[0]
    };

    const pReqDataFile = JSON.parse(fs.readFileSync('./Modules/Library/prayerReqs.json', 'utf8'));

    pReqDataFile.pReqs.push(pReq);

    fs.writeFileSync('./Modules/Library/prayerReqs.json', JSON.stringify(pReqDataFile));

    cmd.reply('Pushed!', 10);
}

function clearList(cmd) {
    const pReqData = { pReqs: [] };
    fs.writeFileSync('./Modules/Library/prayerReqs.json', JSON.stringify(pReqData));

    cmd.reply('Done!', 10);
}