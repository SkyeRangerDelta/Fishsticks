//----VOUCH----
//Vote for a user to join the community.

//Imports
const {recognized} = require('../../Modules/Core/Core_ids.json');
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
    cmd.msg.delete({timeout: 0});

    //Get role
    const recognizedRole = await cmd.msg.guild.roles.fetch(recognized);

    //Interpret vouch
    let vouchee = cmd.msg.mentions.members.first();

    if (vouchee == fishsticks) {
        //Prevent Fs vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch Fishsticks in.`);
        return cmd.msg.reply('*Shakes head* No. This is not how that works.').then(sent => sent.delete({ timeout: 10000 }));
    } else if (vouchee.id == cmd.msg.author.id) {
        //Prevent self-vouching
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch themselves in.`);
        return cmd.msg.reply('*No*. Duh. You cannot vouch for yourself.').then(sent => sent.delete({ timeout: 10000 }));
    } else if (hasPerms(cmd.msg.member, ['CC Member', 'ACC Member'])) {
        //Prevent membership vouches
        log('info', `[VOUCH] ${cmd.msg.member.displayName} tried to vouch someone who didn't need it in.`);
        return cmd.msg.reply(`Why...why don't need it.`).then(sent => sent.delete({ timeout: 10000 }));
    }

    if (!vouchee) {
        log('info', `[VOUCH] ${vouchee} is an invalid vouchee.`);
        throw `I couldn't find the member to vouch for!`;
    }

    //Interact with FSO table
    log('info', `[VOUCH] Pending vouch record...`);
    const vouchQuery = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Vouches', 'select', vouchee.id);

    if (!vouchQuery) {
        //No record found, create one
        log('info', `[VOUCH] No vouch record located, attempting to create one...`);
        const newVouch = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Vouches', 'insert', {
            id: vouchee.id,
            vouches: 1,
            vouchers: [cmd.msg.author.id]
        });

        if (newVouch.inserted == 1) {
            cmd.msg.channel.send(vouchee.displayName + ' has received a vouch. They need another to be granted recognized.');
            log('info', `[VOUCH] Record created.`);
        }
    } else if (vouchQuery.vouches == 1) {
        log('info', `[VOUCH] ${cmd.msg.member.displayName} attempted to grant the last vouch for ${vouchee.displayName}.`);
            if (vouchQuery.vouchers[0] == cmd.msg.author.id) {
                //Record found, but duplicate vouch
                log('info', `[VOUCH] ${cmd.msg.member.displayName} attempted to vouch ${vouchee.displayName} in twice.`);
                return cmd.msg.reply('Hey now, no double vouching.').then(sent => sent.delete({ timeout: 10000 }));
            }
        //Record found, add new vouch...
        const addVouch = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Vouches', 'update', {
            id: vouchee.id,
            vouches: ++vouchQuery.vouches,
            vouchers: vouchQuery.vouchers.concat(cmd.msg.author.id)
        });

        //...and assign role
        if (addVouch.replaced == 1) {
            vouchee.roles.add(recognizedRole, 'Automatic vouch-in.')
            .then(cmd.msg.channel.send(vouchee.displayName + ' has been granted recognized.'))
            .catch(console.error);
            log('info', `[VOUCH] ${vouchee.displayName} granted Recognized.`);
        } else {
            throw 'Something funky happened in FSO.';
        }
    } else if (vouchQuery.vouches >= 2) { //Already vouched in
            log('info', `[VOUCH] ${vouchee.displayName} has already been vouched for twice.`);
            return cmd.msg.reply(vouchee.displayName + ' has already receieved 2 vouches; if they do not have Recognized, get a staff member to look into it.').then(sent => sent.delete({ timeout: 20000 }));
    } else { //Unknown
            log('warn', `[VOUCH] ${cmd.msg.member.displayName} attempted something fishy.`);
        throw 'Something mysterious has occured that the ridiculous amount of conditionals in here has not accounted for.';
    }
}

function help() {
    return 'Vouches a user into the community from the Crash Pad.';
}