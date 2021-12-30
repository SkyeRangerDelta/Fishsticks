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
    cmd.msg.delete();

    //Get role
    recognizedRole = await cmd.msg.guild.roles.fetch(recognized);

    //Interpret vouch
    const vouchee = cmd.msg.mentions.members.first();
    log('info', '[VOUCH] Vouchee ID is ' + vouchee.id);

    if(!vouchee) {
        return cmd.reply('But...you didnt say who to vouch in.', 10);
    }

    if (vouchee.id === fishsticks.user.id) {
        //Prevent Fs vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch Fishsticks in.`);
        return cmd.reply('*Shakes head* No. This is not how that works.', 10);
    }
    else if (vouchee.id === cmd.msg.author.id) {
        //Prevent self-vouching
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch themselves in.`);
        return cmd.reply('*No*. Duh. You cannot vouch for yourself.', 10);
    }
    else if (hasPerms(vouchee, ['Recognized', 'CC Member', 'ACC Member'])) {
        //Prevent membership vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch someone who didn't need it in.`);
        return cmd.reply(`Why...why? ${vouchee.displayName} definitely doesn't need it.`, 10);
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
        return cmd.reply(`I can't do that until ${vouchee.displayName} has a valid FSO record. Get them to say something in chat.`, 20);
    }

    //Do FSO checks/validation then add
    const memberVouches = vouchQuery.vouches;

    if(memberVouches.includes(cmd.msg.author.id)) {
        return cmd.reply(`You've already vouched for ${vouchee.displayName}!`, 10);
    }

    if (memberVouches.length < 2) {
        //clear, do vouch
        await addVouch(fishsticks, cmd, vouchQuery);
    }
    else {
        //Not clear
        return cmd.msg.reply({ content: 'This person has already reached 2 vouches! If they are lacking Recognized despite this, ping Skye.' });
    }

}

async function addVouch(fishsticks, cmd, memberFSORecord) {

    if (memberFSORecord.vouches.length === 0) {
        //None on record, add new record
        const recordUpdate = {
            $push: {
                vouches: cmd.msg.author.id
            }
        };

        const addVouchRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', recordUpdate, { id: memberFSORecord.id });

        if (addVouchRes.modifiedCount === 1) {
            return cmd.reply(`${memberFSORecord.username} has been vouched for and needs only one more vouch.`);
        }
        else {
            return cmd.reply('Mmmmmmmm, something is wrong and the vouch may have not been tallied correctly.', 10);
        }
    }
    else {
        //1 vouch on record, update and add Recognized
        const recordUpdate = {
            $push: {
                vouches: cmd.msg.author.id
            },
            $set: {
                vouchedIn: 'Yes'
            }
        };

        const addVouchRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', recordUpdate, { id: memberFSORecord.id });
        const vouchee = await cmd.msg.guild.members.cache.get(memberFSORecord.id);
        await vouchee.roles.add(recognizedRole, '[VOUCH] Granted recognized on due to reaching 2 vouches.');

        if (addVouchRes.modifiedCount === 1) {
            cmd.channel.send({ content: `${memberFSORecord.username} has been vouched for and has been granted Recognized!` });
            return handleNewMember(fishsticks, vouchee); //Handle member welcome graphic
        }
        else {
            return cmd.reply('Mmmmmmmm, something is wrong and the vouch may have not been tallied correctly.', 20);
        }
    }
}

function help() {
    return 'Vouches a user into the community from the Crash Pad.';
}