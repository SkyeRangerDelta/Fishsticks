//----VOUCH----
//Vote for a user to join the community.

//Imports
const { recognized } = require('../../Modules/Core/Core_ids.json');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { hasPerms } = require('../../Modules/Utility/Utils_User');

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    //Get role
    const recognizedRole = await cmd.msg.guild.roles.fetch(recognized);

    //Interpret vouch
    const vouchee = cmd.msg.mentions.members.first();

    if (vouchee == fishsticks) {
        //Prevent Fs vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch Fishsticks in.`);
        return cmd.msg.reply('*Shakes head* No. This is not how that works.').then(sent => sent.delete({ timeout: 10000 }));
    }
    else if (vouchee.id == cmd.msg.author.id) {
        //Prevent self-vouching
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch themselves in.`);
        return cmd.msg.reply('*No*. Duh. You cannot vouch for yourself.').then(sent => sent.delete({ timeout: 10000 }));
    }
    else if (hasPerms(cmd.msg.member, ['CC Member', 'ACC Member'])) {
        //Prevent membership vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch someone who didn't need it in.`);
        return cmd.msg.reply(`Why...why? ${vouchee.displayName} doesn't need it.`).then(sent => sent.delete({ timeout: 10000 }));
    }

    if (!vouchee) {
        log('info', `[VOUCH] ${vouchee} is an invalid vouchee.`);
        throw 'I could not find the member to vouch for!';
    }

    //Interact with FSO table
    log('info', '[VOUCH] Pending vouch record...');
    const vouchQuery = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_MemberStats', 'select', vouchee.id);

    if (!vouchQuery) {
        log('info', '[VOUCH] Failed to collect vouchee record!');
        return cmd.msg.reply(`I can't do that until ${vouchee.displayName} has a valid FSO record. Get them to say something in chat.`).then(sent => sent.delete({ timeout: 20000 }));
    }

    //Do FSO validations and checks

    //If passes; conduct vouch add

    //If vouched in; add Recognized

}

function help() {
    return 'Vouches a user into the community from the Crash Pad.';
}