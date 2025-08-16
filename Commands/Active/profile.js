//---- PROFILE ----
// XP profile

//Imports
const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { timeSinceDate } = require( '../../Modules/Utility/Utils_Time' );
const { buildProfileBanner } = require( '../../Modules/Utility/Utils_Profile' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );
const { MessageFlags } = require( "discord-api-types/v10" );
const { embedBuilder } = require( '../../Modules/Utility/Utils_EmbedBuilder' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'profile' )
    .setDescription( 'Displays your FSO profile,' );

data.addSubcommand( s => s
    .setName( 'detailed' )
    .setDescription( 'Displays full FSO profile.' ) );

data.addSubcommand( s => s
    .setName( 'lite' )
    .setDescription( 'Displays FSO profile without a banner.' ) );

//Functions
async function run( fishsticks, int ) {
    await int.deferReply();
    const subCMD = int.options.getSubcommand();
    let profileEmbed = null;

    //Get FSO record
    const memberProf = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: int.member.id } );

    let spentGoldfish = memberProf.xp.spentGoldfish;
    if( spentGoldfish === null ) {
        spentGoldfish = 0;
    }

    //Process notification prefs
    const notifPrefs = memberProf.notifications;
    let notifVal = '';

    for ( const [key, val] of Object.entries( notifPrefs ) ) {
        notifVal += `**${key}**: ${val}`;
    }

    //Do embed
    profileEmbed = {
        title: `o0o - ${int.member.displayName}'s Profile - o0o`,
        description: 'A synopsis of your FSO profile and XP data.',
        footer: {
            text: 'FSO data may be slightly inaccurate depending on activity surrounding when this command was executed.'
        },
        fields: [
            {
                name: 'Join Date',
                value: memberProf.joinTimeFriendly + ' (Been a member for ' + timeSinceDate( memberProf.joinMs ) + ').',
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

    if ( subCMD === 'detailed' ) {
        await int.editReply( { content: 'Its coming right up, baking in the oven...', flags: MessageFlags.Ephemeral } );
        return await buildProfileBanner( fishsticks, int, profileEmbed );
    }
    else {
        await int.editReply( { embeds: [embedBuilder( fishsticks, profileEmbed )] } );
    }
}

function help() {
    return 'Displays your FSO profile';
}

//Exports
module.exports = {
    name: 'profile',
    data,
    run,
    help
};