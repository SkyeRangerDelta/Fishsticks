//---- PROFILE ----
// XP profile

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { convertMsFull, timeSinceDate } = require('../../Modules/Utility/Utils_Time');
const { buildProfileBanner } = require('../../Modules/Utility/Utils_Profile');

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete();

    //Get FSO record
    const memberProf = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: cmd.msg.author.id });

    let spentGoldfish = memberProf.xp.spentGoldfish;
    if(spentGoldfish === null) {
        spentGoldfish = 0;
    }

    //Process notification prefs
    const notifPrefs = memberProf.notifications;
    let notifVal = '';

    for (const [key, val] of Object.entries(notifPrefs)) {
        notifVal += `**${key}**: ${val}`;
    }

    //Do embed
    const profileEmbed = {
        title: `o0o - ${cmd.msg.member.displayName}'s Profile - o0o`,
        description: 'A synopsis of your FSO profile and XP data.',
        footer: 'FSO data may be slightly inaccurate depending on activity surrounding when this command was executed.',
        delete: 60000,
        fields: [
            {
                name: 'Join Date',
                value: memberProf.joinTimeFriendly + ' (Been a member for ' + timeSinceDate(memberProf.joinMs) + ').',
                inline: false
            },
            {
                name: 'Command Attempts',
                value: `${ memberProf.acAttempts }`,
                inline: true
            },
            {
                name: 'Command Successes',
                value: `${ memberProf.acSuccess }`,
                inline: true
            },
            {
                name: 'Passive Successes',
                value: `${ memberProf.pcSuccess }`,
                inline: true
            },
            {
                name: 'Suggestions Posted',
                value: `${ memberProf.suggestionsPosted }`,
                inline: true
            },
            {
                name: 'Messages Sent',
                value: `${ memberProf.messagesSent }`,
                inline: true
            },
            {
                name: 'Collected XP',
                value: `${ memberProf.xp.RP }`,
                inline: true
            },
            {
                name: 'Goldfish',
                value: `${ memberProf.xp.goldfish }`,
                inline: true
            },
            {
                name: 'Spent Goldfish',
                value: `${ spentGoldfish }`,
                inline: true
            },
            {
                name: 'Vouched Member?',
                value: memberProf.vouchedIn,
                inline: true
            },
            {
                name: 'Notification Preferences',
                value: notifVal,
                inline: false
            }
        ]
    };

    return await buildProfileBanner(fishsticks, cmd, profileEmbed);
}

function help() {
    return 'Displays your FSO profile';
}