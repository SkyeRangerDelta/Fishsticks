// ---- Notifications ----
// Allows notifications to be toggled

//Imports
const { ActionRowBuilder, StringSelectMenuBuilder } = require( 'discord.js' );
const { fso_query } = require( '../../Modules/FSO/FSO_Utils' );
const { SlashCommandBuilder } = require( '@discordjs/builders' );

//Globals
const data = new SlashCommandBuilder()
    .setName( 'notifications' )
    .setDescription( 'Allows various notifications to be toggled on or off.' );

//Functions
async function run( fishsticks, int ) {
    //Grab notification preferences
    const memberProf = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: int.member.id } );
    let memberNotifPrefs;

    //Parse members without notifications
    if ( !memberProf.notifications ) {
        await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', { $set: { 'notifications.xp': true } }, { id: int.member.id } );
        memberNotifPrefs = {
            xp: true
        };
    }
    else {
        memberNotifPrefs = memberProf.notifications;
    }

    //Build interaction post
    const msgRow = new ActionRowBuilder();
    const notifValues = [];

    if ( memberNotifPrefs.xp ) {
        notifValues.push( {
            label: 'Level Up Info -> Off',
            description: 'Toggles off XP level up banner/notices.',
            value: 'xp'
        } );
    }
    else {
        notifValues.push( {
            label: 'Level Up Info -> On',
            description: 'Toggles on XP level up banner/notices.',
            value: 'xp'
        } );
    }

    msgRow.addComponents(
        new StringSelectMenuBuilder()
            .setCustomId( 'NOTI-M' )
            .setPlaceholder( 'Select something?' )
            .setMaxValues( 1 )
            .setMinValues( 1 )
            .addOptions( notifValues )
    );

    //Dispatch post
    return int.reply( { content: `${int.member.displayName}'s notification settings:`, components: [msgRow], ephemeral: true } );
}

function help() {
    return 'Allows various notifications to be toggled on or off.';
}

async function handleNotificationToggle( fishsticks, interaction ) {
    //Get the notification record from FSO
    const memberProf = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: interaction.member.id } );
    const changedVals = interaction.values;

    //Sift through changed values and update FSO
    let updates = 0;
    for ( const op in changedVals ) {
        if ( changedVals[op] === 'xp' ) {
            //Toggle XP notices
            const currXpState = memberProf.notifications.xp;
            const xpState = !currXpState;
            const xpToggleRes = await fso_query( fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', { $set: { 'notifications.xp': xpState } }, { id: interaction.member.id } );

            if ( xpToggleRes.modifiedCount === 1 ) {
                updates++;
            }
        }
    }
    return interaction.reply( { content: `Updated ${updates} setting(s).`, ephemeral: true } );
}

//Exports
module.exports = {
    name: 'notifications',
    data,
    run,
    help,
    handleNotificationToggle
};