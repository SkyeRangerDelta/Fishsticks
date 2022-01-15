//------GAME ROLE SUBROUTINE-------
//=================================

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');

const { DuplicatedRoleException } = require('../../Modules/Errors/DuplicatedRoleException');
const { InvalidParameterException } = require('../../Modules/Errors/InvalidParameterException');

const { DateTime } = require('luxon');

//Exports
module.exports = {
    run,
    help,
    findRole,
    listRoles
};

//Globals
let currentPool;
let memberFSO;
let params = null;
const curMDN = DateTime.now().setZone('UTC-5');

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 10000 });

    params = cmd.content;

    //Obtain a current set of roles in array for future use
    const queryRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'selectAll');
    memberFSO = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'select', { id: `${cmd.msg.author.id}` });

    //Recalibrate time indexes and perform table maintenance
    await updateRoles(fishsticks, queryRes);

    //Parse the query
    parseRequest(fishsticks, cmd, queryRes).catch(e => {
        cmd.reply({ content: '*Ok but why.*\n' + e });
    });

    //Possible syntax
    //!role -[func] -[options] -[content]

    /*
    !role -new -name -game -description
    !role -edit -ID -param -new value
    !role -vote -name/game
    !role -join -name/game
    !role -leave -name/game
    !role -stats -name/game
    !role -list
    !role -show -name/game
    */

}
async function parseRequest(fishsticks, cmd) {
    //Validate func
    if (!params || !params[0] || params[0] === null) {
        return cmd.reply('What am I going to do with you. You need to specify what your intentions are.', 10);
    }

    if (params[0] === 'n' || params[0] === 'new') {
        log('info', '[ROLE-SYS] Creating a new role.');

        //Validate all required parameters existence
        if (!params[1] || params[1] === null) {
            return cmd.reply('A capital choice. A new role with no name. Fantastic.');
        }
        if (!params[2] || params[2] === null) {
            return cmd.reply('Why are you the way that you are? I need a game name to go with the role.');
        }
        if (!params[3] || params[3] === null) {
            return cmd.reply('For the sake of knowing what people are getting into, perhaps it would be conducive to add a description to the new role.');
        }

        //Begin new role listing
        console.log(params);

        newRole(fishsticks, cmd).catch(e => {
            log('warn', `[ROLE-SYS] ${e.name} : ${e.message}`);
        });
    }
    else if (params[0] === 'e' || params[0] === 'edit') {
        log('info', '[ROLE-SYS] Editing a role.');

        //!role -edit -ID -param -new value

        return cmd.reply('Editing isnt done quite yet, check back later.', 10);

        //Validate all required parameters existence
        //await editRole(fishsticks, cmd);
    }
    else if (params[0] === 'v' || params[0] === 'vote') {
        log('info', '[ROLE-SYS] Voting for a role.');

        if (!params[1]) {
            return cmd.reply('Specify a role to vote for!');
        }

        voteRole(fishsticks, cmd).catch(e => {
            log('warn', `[ROLE-SYS] ${e.message}`);
        });
    }
    else if (params[0] === 'j' || params[0] === 'join') {
        log('info', '[ROLE-SYS] Joining a role.');

        if (!params[1]) {
            return cmd.reply('Specify a role to join!');
        }

        await joinRole(fishsticks, cmd);
    }
    else if (params[0] === 'l' || params[0] === 'leave') {
        log('info', '[ROLE-SYS] Leaving a role.');

        if (!params[1]) {
            return cmd.reply('Specify a role to leave!');
        }

        await leaveRole(fishsticks, cmd);
    }
    else if (params[0] === 's' || params[0] === 'stats') {
        log('info', '[ROLE-SYS] Getting the statistics for a role.');

        await roleStats(fishsticks, cmd);
    }
    else if (params[0] === 'list') {
        log('info', '[ROLE-SYS] Listing roles.');

        await listRoles(fishsticks, cmd);
    }
    else if (params[0] === 'show') {
        log('info', '[ROLE-SYS] Showing the about for a role.');

        await aboutRole(fishsticks, cmd);
    }
    else if (params[0] === 'sync') {
        log('info', '[ROLE-SYS] Syncing Discord game roles to FSO.');

        return cmd.reply('No need for this one, carry on.', 10);
        //syncRoles(fishsticks, cmd);
    }
    else {
        throw 'You need to state your intentions!';
    }
}

//Create a new role
async function newRole(fishsticks, cmd) {
    //Assume !role -new -name -game -description

    const curFlexTime = flexTime();
    const roleTimeout = curMDN.plus({ 'weeks': 2 });

    //Create role Obj
    const newRoleObj = {
        name: toTitleCase(params[1]),
        creator: cmd.msg.member.displayName,
        game: toTitleCase(params[2]),
        description: params[3],
        created: curMDN,
        createdFriendly: curFlexTime,
        activated: null,
        timeout: roleTimeout,
        timeoutFriendly: roleTimeout.toLocaleString(DateTime.DATETIME_MED),
        pings: 0,
        votes: 1,
        founders: [cmd.msg.author.id],
        members: [],
        active: false,
        permanent: false,
        activityFactor: 0
    };

    //Verify not duplicate
    const dupeCheck = checkDupes(newRoleObj, cmd);
    if (dupeCheck !== 1) {
        throw new DuplicatedRoleException(dupeCheck);
    }

    //Add role to the listings
    const addRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'insert', newRoleObj);
    if (addRes.acknowledged === true) {
        cmd.reply('Role listed.');
    }
    else {
        throw 'Something went wrong adding the role to the listings...';
    }
}

//Edit a role
async function editRole(fishsticks, cmd) {
    cmd.channel.send({ content: 'Cant do this just yet!' }).then(sent => {
        setTimeout(() => sent.delete(), 10000);
    });
}

//Vote for a role
async function voteRole(fishsticks, cmd, roleY) {

    //If redirect from join, use already existing role process
    let roleObj;

    if (!roleY) {
        roleObj = await findRole();
    }
    else {
        roleObj = roleY;
    }

    if (roleObj === -1) {
        throw 'That role doesnt exist!';
    }
    else if (roleObj.votes >= 5) {
        return cmd.reply('This role has already been officialized, assigning it instead...', 10);
    }
    else {
        //Run through founders to prevent dupe
        for (const memID in roleObj.founders) {
            if (roleObj.founders[memID] === cmd.msg.author.id) {
                return cmd.reply('You already voted for this role! Get outta here!', 10);
            }
        }

        //Determine new timeout in ms
        const timeDiff = curMDN.plus({ 'weeks': 2 });

        const updateObj = {
            $inc: {
                votes: 1
            },
            $push: {
                founders: cmd.msg.author.id
            },
            $set: {
                timeout: timeDiff,
                timeoutFriendly: timeDiff.toLocaleString(DateTime.DATETIME_MED)
            }
        };

        const updateRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', updateObj, { name: roleObj.name });

        if (updateRes.modifiedCount !== 1) {
            throw 'Role update in FSO failed!';
        }
        else if (roleObj.votes + 1 >= 5) {
            log('info', '[ROLE-SYS] Role has 5 votes, activating...');
            await activateRole(fishsticks, cmd, roleObj);
        }
        else {
            const missingVotes = 5 - roleObj.votes + 1;

            cmd.reply(`Vote counted; ${roleObj.name} requires ${missingVotes} vote(s) before being activated!`, 10);
        }
    }
}

//Join a role
async function joinRole(fishsticks, cmd) {
    //Check active
    const roleX = await findRole();

    if (roleX.active === false) {
        //Vote role override
        cmd.reply('Role not active, voting for it instead.', 10);
        return await voteRole(fishsticks, cmd, roleX);
    }
    else {
        //Get role and add
        const roleY = await cmd.msg.guild.roles.cache.find(role => role.name === `${roleX.name}`);
        cmd.msg.member.roles.add(roleY).then(function() {

            //Update FSO with the new role list
            const roleUpdate = {
                $push: {
                    members: cmd.msg.author.id
                }
            };

            fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', roleUpdate, { id: roleX.id }).then(done => {
                if (done.modifiedCount === 1) {
                    cmd.channel.send(`${cmd.msg.member} has joined ${roleY}!`);
                }
                else {
                    cmd.reply('Something is...incorrect. Have someone check your roles.');
                }
            });
        }).catch(err => {
            cmd.reply('Something went wrong trying to add your role.\n' + err, 10);
        });
    }
}
//

//Leave a role
async function leaveRole(fishsticks, cmd) {
    //Check active
    const roleX = await findRole();
    if (roleX.active === false) {
        //Vote role override
        cmd.reply('No active role to leave!', 10);
    }
    else {
        //Get role and remove
        const roleY = await cmd.msg.guild.roles.cache.find(role => role.name === `${roleX.name}`);
        cmd.msg.member.roles.remove(roleY).then(function() {

            //Sort through founders and strikethrough if listed
            for (const i in roleX.founders) {

            }

            //Update FSO with the new role list
            const roleUpdate = {
                $set: {
                    roles: memberRolesList
                }
            };

            fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', roleUpdate, { id: cmd.msg.author.id })
                .then(done => {
                if (done.modifiedCount === 1) {
                    cmd.channel.send('Role removed.').then(sent => {
                        setTimeout(() => sent.delete(), 10000);
                    });
                }
                else {
                    cmd.reply('Something is...incorrect. Have someone check your roles.');
                }
            });
        }).catch(err => {
            cmd.reply('Something went wrong trying to remove your role.\n' + err, 10);
        });
    }
}

//Print the statistics for all roles
async function roleStats(fishsticks, cmd) {
    cmd.reply('Insert neat things here.', 10);
}

//List all roles
async function listRoles(fishsticks, cmd, ext) {

    if (ext) { //External inquery, update role listing
        await updateRoles(fishsticks, await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'selectAll'));
    }

    let activeRoleList = '';
    let inactiveRoleList = '';

    //Iterate roles
    for(const role in currentPool) {
        if (currentPool[role].active) {
            activeRoleList += `**${currentPool[role].name}**: ${currentPool[role].game}\n`;
        }
        else if (currentPool[role].permanent) {
            inactiveRoleList += `**${currentPool[role].name}**: ${currentPool[role].game}\n`;
        }
        else {
            inactiveRoleList += `**${currentPool[role].name}**: ${currentPool[role].game} (*Requires ${5 - currentPool[role].votes} votes* before ${currentPool[role].timeoutFriendly})\n`;
        }
    }

    if (activeRoleList === '') {
        activeRoleList = 'Theres nothing in here? Huh.';
    }
    if (inactiveRoleList === '') {
        inactiveRoleList = 'No inactive roles!';
    }

    const roleListEmbed = {
        title: 'o0o - Role Listing [Active] - o0o',
        description: activeRoleList,
        delete: 45000,
        footer: 'Active role listings pulled from FSO.'
    };

    const inactiveListEmbed = {
        title: 'o0o - Role Listing [Inactive] - o0o',
        description: inactiveRoleList,
        delete: 45000,
        footer: 'Inactive role listings pulled from FSO.'
    };

    cmd.channel.send({ embeds: [embedBuilder(roleListEmbed)] }).then(sent => {
        setTimeout(() => sent.delete(), 45000);
        cmd.channel.send({ embeds: [embedBuilder(inactiveListEmbed)] }).then(sent2 => {
            setTimeout(() => sent2.delete(), 45000);
        });
    });
}

//Print the stats for a single role
async function aboutRole(fishsticks, cmd) {
    const roleObj = await findRole();

    if(!roleObj || roleObj === -1) {
        return cmd.reply('No role found!', 10);
    }

    log('info', '[ROLE] Displaying about for ' + roleObj.name);

    let roleCount = 'N/A';

    if (roleObj.active) {
        const discordRole = await fishsticks.CCG.roles.fetch(roleObj.id);
        roleCount = await discordRole.members.map(m => m.id).length;
    }

    let activeField;

    if (roleObj.active) {
        activeField = {
            name: 'Activated On',
            value: `${ roleObj.activated }`,
            inline: true
        };
    }
    else {
        activeField = {
            name: 'Votes',
            value: `${ roleObj.votes }`,
            inline: true
        };
    }

    let foundersList = '';
    let membersList = '';

    if (roleObj.founders.length === 0) {
        foundersList = 'This mustve been created pre-V18. No data.';
    }
    else {
        for (const founder in roleObj.founders) {
            const founderMember = await fishsticks.CCG.members.fetch(roleObj.founders[founder]);
            foundersList += `${founderMember.displayName}\n`;
        }
    }

    if (roleObj.members.length === 0) {
        membersList = 'Looks pretty empty in here.';
    }
    else {
        for (const member in roleObj.members) {
            const memberMember = await fishsticks.CCG.members.fetch(roleObj.members[member]);
            membersList += `${memberMember.displayName}\n`;
        }
    }

    const roleEmbed = {
        title: `o0o - ${roleObj.name} Role Info - o0o`,
        description: roleObj.description,
        noThumbnail: true,
        footer: `Footer summoned by ${cmd.msg.member.displayName}.`,
        fields: [
            {
                name: 'Creator',
                value: `${ roleObj.creator }`,
                inline: true
            },
            {
                name: 'Game',
                value: `${ roleObj.game }`,
                inline: true
            },
            {
                name: 'Created On',
                value: `${ roleObj.createdFriendly }`,
                inline: true
            },
            {
                name: 'Active?',
                value: `${ roleObj.active }`,
                inline: true
            },
            activeField,
            {
                name: 'Activity Factor',
                value: `${ roleObj.activityFactor }`,
                inline: true
            },
            {
                name: 'Timeout Date',
                value: `${ roleObj.timeoutFriendly }`,
                inline: true
            },
            {
                name: 'Pings',
                value: `${ roleObj.pings }`,
                inline: true
            },
            {
                name: 'Members With Tag',
                value: '`' + `${roleCount}` + '`',
                inline: true
            },
            {
                name: 'Founding Members',
                value: `${ foundersList }`,
                inline: true
            },
            {
                name: 'Members',
                value: `${ membersList }`,
                inline: true
            }
        ],
        delete: 30000
    };

    return cmd.channel.send({ content: 'Role info.', embeds: [embedBuilder(roleEmbed)] }).then(sent => {
        setTimeout(() => sent.delete(), 30000);
    });
}

//Activate the role
async function activateRole(fishsticks, cmd, obj) {
    log('info', '[ROLE-SYS] Preparing to activate role...');

    //Get refreshed role data
    const roleData = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'select', { name: obj.name });

    console.log(roleData);

    const roleCount = fishsticks.CCG.roles.cache.length;
    try {
        //Create role
        await fishsticks.CCG.roles.create({
            name: roleData.name,
            color: '#9e876e',
            mentionable: true,
            position: roleCount,
            reason: '[ROLE-SYS] Game role subroutine has created a new role based on the votes fo 5 different members.'
        }).then(async newRoleObj => {
            log('proc', `[ROLE-SYS] Created new role ${newRoleObj.name}`);
            cmd.reply('Activation successful!', 10);

            const updateData = {
                $set: {
                    id: newRoleObj.id,
                    active: true,
                    permanent: true,
                    activated: flexTime()
                }
            };

            log('info', '[ROLE-SYS] Sending FSO Update');
            await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', updateData, { name: roleData.name });

            //Assign to founders
            log('info', '[ROLE-SYS] Assigning new role to members');
            for (const indexA in roleData.founders) {
                const memberItem = await fishsticks.CCG.members.fetch(`${roleData.founders[indexA]}`);

                console.log(`Adding ${newRoleObj.name} to ${memberItem.displayName}.`);

                await memberItem.roles.add(newRoleObj, '[ROLE-SYS] Role added automatically after having voted for it.');
                cmd.channel.send(`${memberItem.displayName} - you've been assigned ${roleData.name} because you voted for it!`).then(sent => {
                    setTimeout(() => sent.delete(), 15000);
                });
            }

            //Send role ping to games


        });
    }
    catch (roleCreateErr) {
        log('err', '[ROLE-SYS] Error creating the role!\n' + roleCreateErr);
    }
}

//Util Funcs

//Prevent duplicates
function checkDupes(roleObj, cmd) {
    for (const roleItem in currentPool) {
        if (currentPool[roleItem].name === roleObj.name) {
            cmd.reply('This role already exists!', 10);
            return -1;
        }
        else if (currentPool[roleItem].game === roleObj.name) {
            cmd.reply('*Suspecting sus*; that role name already exists as a game in the listing.', 10);
            return -2;
        }
        else if (currentPool[roleItem].name === roleObj.game) {
            cmd.reply('There is a role with that game as its name already in the listing!', 10);
            return -3;
        }
        else if (currentPool[roleItem].game === roleObj.game) {
            cmd.reply('A role with that game already exists!', 10);
            return -4;
        }
    }

    return 1;
}

//Find a role
async function findRole(fishsticks, extQuery) {

    if (extQuery != null || extQuery !== undefined) {
        log('info', '[ROLE-SYS] Returning role ID');
        //Incoming query from a different command
        await updateRoles(fishsticks, await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'selectAll'));

        log('info', '[ROLE-SYS] Fetching role for external command.');

        const query = toTitleCase(extQuery);

        for (const roleItem in currentPool) {
            if (query === currentPool[roleItem].name) {
                log('proc', '[ROLE-SYS] Found a role.');
                if (currentPool[roleItem].active) {
                    return currentPool[roleItem].discordID;
                }
            }
            else if (query === currentPool[roleItem].game) {
                log('proc', '[ROLE-SYS] Found a role.');
                if (currentPool[roleItem].active) {
                    return currentPool[roleItem].discordID;
                }
            }
        }

        return -1;
    }
    else {
        log('info', '[ROLE-SYS] Returning role object.');
        //Internal query
        if (!params[1] || params[1] === null) {
            throw new InvalidParameterException('No name or game was supplied!');
        }

        const query = toTitleCase(params[1]);

        for (const roleItem in currentPool) {
            if (query === currentPool[roleItem].name) {
                log('proc', '[ROLE-SYS] Found a role.');
                return currentPool[roleItem];
            }
            else if (query === currentPool[roleItem].game) {
                log('proc', '[ROLE-SYS] Found a role.');
                return currentPool[roleItem];
            }
        }

        return -1;
    }
}

//Delete a role (SYSTEM ONLY)
async function delRole(fishsticks, id) {
    const delRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'delete', id);

    if (delRes.deleted !== 1) {
        log('err', '[ROLE-SYS] Failed to delete role.');
    }
    else {
        log('proc', '[ROLE-SYS] Deleted role with id: ' + id);
    }
}

//Mass update and callibrate days
async function updateRoles(fishsticks, poolRes) {
    log('warn', '[ROLE-SYS] [MAINT] Conducting role updates and table maintenance');

    //Do pool gen
    currentPool = poolRes;

    //Iterate over all roles
    for (const roleObj in currentPool) {
        log('warn', `[ROLE-SYS] [MAINT] Checking ${currentPool[roleObj].name} (ID: ${currentPool[roleObj].id})`);

        //Remove all inactive roles past timeout date
        if (!currentPool[roleObj].permanent) {
            if (curMDN > currentPool[roleObj].timeout) {
                log('warn', '[ROLE-SYS] Deleting role (inactivity): ' + currentPool[roleObj].name);
                await delRole(fishsticks, currentPool[roleObj].id);
            }
        }
    }
}

//Sync game-roles in Discord to FSO
async function syncRoles(fishsticks, cmd) {
    const roleList = await populateRoleList(fishsticks);

    const syncRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'insertMany', roleList);

    if(syncRes.insertedCount !== roleList.length) {
        cmd.reply('Not all roles were synced to FSO!');
    }
    else {
        cmd.reply('All roles synced to FSO.', 15);
    }

}

async function populateRoleList(fishsticks) {
    const grColor = 10389358; //Decimal number of the hex color code: #9e876e
    const roleList = [];
    const roleCache = Array.from(fishsticks.CCG.roles.cache.values());

    for (const roleIndex in roleCache) {
        const role = roleCache[roleIndex];

        if (role.color === grColor) {
            const roleData = await processRole(role);
            roleList.push(roleData);
        }
    }

    log('info', '[ROLE-SYNC] Role listing to sync holds ' + roleList.length + ' roles.');
    console.log(roleList);
    return roleList;
}

async function processRole(role) {
    const roleTimeout = DateTime.now().setZone('UTC-5').plus({ 'weeks': 2 });

    log('info', '[ROLE-SYNC] Processing ' + role.name);
    const newRoleObj = {
        id: role.id,
        name: role.name,
        creator: 'Fishsticks',
        game: 'Something Relevant',
        description: 'Role created pre-V18, no info.',
        created: role.createdAt,
        createdFriendly: new DateTime(role.createdAt).toLocaleString(DateTime.DATETIME_MED),
        activated: true,
        timeout: roleTimeout,
        timeoutFriendly: `${roleTimeout.toLocaleString(DateTime.DATETIME_MED)}`,
        pings: 0,
        votes: 5,
        founds: [],
        members: [],
        active: true,
        permanent: true,
        activityFactor: 0
    };

    const memberList = Array.from(role.members.values());
    for (const memberIndex in memberList) {
        newRoleObj.members.push((memberList[memberIndex].user.id));
    }

    return newRoleObj;
}


//Help
function help() {
    return 'Enables game role controls.';
}