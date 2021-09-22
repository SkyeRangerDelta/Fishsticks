//----VOUCH----
//Vote for a user to join the community.

//Imports
const { recognized } = require('../../Modules/Core/Core_ids.json');
const { handleNewMember } = require('../../Modules/Core/Core_NewMember');
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { hasPerms } = require('../../Modules/Utility/Utils_User');

//Exports
module.exports = {
    run,
    help
};

//Globals
let recognizedRole;

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    //Get role
    recognizedRole = await cmd.msg.guild.roles.fetch(recognized);

    //Interpret vouch
    const vouchee = cmd.msg.mentions.members.first();

    if (vouchee === fishsticks) {
        //Prevent Fs vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch Fishsticks in.`);
        return cmd.msg.reply({ content: '*Shakes head* No. This is not how that works.' })
            .then(sent => sent.delete({ timeout: 10000 }));
    }
    else if (vouchee.id === cmd.msg.author.id) {
        //Prevent self-vouching
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch themselves in.`);
        return cmd.msg.reply({ content: '*No*. Duh. You cannot vouch for yourself.' })
            .then(sent => sent.delete({ timeout: 10000 }));
    }
    else if (hasPerms(cmd.msg.member, ['CC Member', 'ACC Member'])) {
        //Prevent membership vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch someone who didn't need it in.`);
        return cmd.msg.reply({ content: `Why...why? ${vouchee.displayName} definately doesn't need it.` })
            .then(sent => sent.delete({ timeout: 10000 }));
    }

    if (!vouchee) {
        log('info', `[VOUCH] ${vouchee} is an invalid vouchee.`);
        throw 'I could not find the member to vouch for!';
    }

    //Interact with FSO table
    log('info', '[VOUCH] Pending vouch record...');
    const vouchQuery = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: vouchee.id });

    if (!vouchQuery) {
        log('info', '[VOUCH] Failed to collect vouchee record!');
        return cmd.msg.reply({ content: `I can't do that until ${vouchee.displayName} has a valid FSO record. Get them to say something in chat.` })
            .then(sent => sent.delete({ timeout: 20000 }));
    }

    //Do FSO checks/validation then add
    const memberVouches = vouchQuery.vouches;

    if (memberVouches.length < 2) {
        //clear, do vouch
        await addVouch(fishsticks, vouchQuery);
    }
    else {
        //Not clear
        return cmd.msg.reply({ content: 'This person has already reached 2 vouches! If they are lacking Recognized despite this, ping Skye.' });
    }

}

async function addVouch(fishsticks, cmd, memberFSORecord) {

    if (memberFSORecord.roles === 0) {
        //None on record, add new record
        const recordUpdate = {
            id: memberFSORecord.id,
            vouches: [cmd.msg.author.id]
        };

        const addVouchRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', recordUpdate);

        if (addVouchRes.modifiedCount === 1) {
            return cmd.msg.reply({ content: `${memberFSORecord.username} has been vouched for!` });
        }
        else {
            return cmd.msg.reply({ content: 'Mmmmmmmm, something is wrong and the vouch may have not been tallied correctly.' })
                .then(sent => sent.delete({ timeout: 10000 }));
        }
    }
    else {
        //1 vouch on record, update and add Recognized
        const recordUpdate = {
            id: memberFSORecord.id,
            vouches: memberFSORecord.vouches.push(cmd.msg.author.id)
        };

        const addVouchRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', recordUpdate);
        const vouchee = await cmd.msg.guild.members.get(memberFSORecord.id);
        await vouchee.roles.add(recognizedRole, '[VOUCH] Granted recognized on due to reaching 2 vouches.');

        if (addVouchRes.modifiedCount === 1) {
            cmd.msg.reply({ content: `${memberFSORecord.username} has been vouched for and has been granted Recognized!` });
            return handleNewMember(fishsticks, vouchee); //Handle member welcome graphic
        }
        else {
            return cmd.msg.reply({ content: 'Mmmmmmmm, something is wrong and the vouch may have not been tallied correctly.' })
                .then(sent => sent.delete({ timeout: 10000 }));
        }
    }
}

function help() {
    return 'Vouches a user into the community from the Crash Pad.';
}