//------GAME ROLE SUBROUTINE-------
//=================================

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { systemTimestamp, flexTime } = require('../../Modules/Utility/Utils_Time');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');

const { DuplicatedRoleException } = require('../../Modules/Errors/DuplicatedRoleException');
const { InvalidParameterException } = require('../../Modules/Errors/InvalidParameterException');

const dateMod = require('date-and-time');

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
    if (!params[0] || params[0] === null) {
        throw 'What am I going to do with you. You need to specify what your intentions are.';
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

        //Validate all required parameters existence
        editRole(fishsticks, cmd);
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

        joinRole(fishsticks, cmd);
    }
    else if (params[0] === 'l' || params[0] === 'leave') {
        log('info', '[ROLE-SYS] Leaving a role.');

        if (!params[1]) {
            return cmd.reply('Specify a role to leave!');
        }

        leaveRole(fishsticks, cmd);
    }
    else if (params[0] === 's' || params[0] === 'stats') {
        log('info', '[ROLE-SYS] Getting the statistics for a role.');

        roleStats(fishsticks, cmd);
    }
    else if (params[0] === 'list') {
        log('info', '[ROLE-SYS] Listing roles.');

        listRoles(fishsticks, cmd);
    }
    else if (params[0] === 'show') {
        log('info', '[ROLE-SYS] Showing the about for a role.');

        aboutRole(fishsticks, cmd);
    }
    else {
        throw 'You need to state your intentions!';
    }
}

//Create a new role
async function newRole(fishsticks, cmd) {
    //Assume !role -new -name -game -description

    const curFlexTime = flexTime();
    const curMDN = new Date();
    const roleTimeout = dateMod.addDays(curMDN, 14);

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
        timeoutFriendly: flexTime(roleTimeout),
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
async function voteRole(fishsticks, cmd) {

    const roleObj = await findRole();

    if (roleObj === -1) {
        throw 'That role doesnt exist!';
    }
    else if (roleObj.votes >= 5) {
        return cmd.reply('This role has already been officialized, assigning it instead...', 10000);
    }
    else {
        for (const memID in roleObj.founders) {
            if (roleObj.founders[memID] === cmd.msg.author.id) {
                return cmd.reply('You already voted for this role! Get outta here!', 10000);
            }
        }

        //Determine new timeout in ms
        const curMDN = new Date();
        const timeDiffMS = dateMod.subtract(roleObj.created, curMDN).toMilliseconds();
        const timeDiff = dateMod.addMilliseconds(roleObj.timeout, timeDiffMS);

        if (isNaN(timeDiff) || !timeDiff) {
            throw 'Failed to determine timeout difference.';
        }

        const updateObj = {
            id: roleObj.id,
            votes: roleObj.votes + 1,
            founders: roleObj.founders,
            timeout: timeDiff,
            timeoutFriendly: flexTime(timeDiff)
        };

        updateObj.founders.push(cmd.msg.author.id);

        if (updateObj.votes === 5) {
            await activateRole(fishsticks, cmd, updateObj);
        }
        else {
            const updateRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', updateObj);

            if (updateRes.modifiedCount !== 1) {
                throw 'Role update in FSO failed!';
            }
            else {
                const missingVotes = 5 - updateObj.votes;

                cmd.reply(`Vote counted; ${roleObj.name} requires ${missingVotes} vote(s) before being activated!`, 10000);
            }
        }
    }
}

//Join a role
async function joinRole(fishsticks, cmd) {
    //Check active
    const roleX = await findRole();

    console.log(roleX);

    if (roleX.active === false) {
        //Vote role override
        cmd.reply('Role not active, voting for it instead.', 10000);
        await voteRole(fishsticks, cmd);
    }
    else {
        //Get role and add
        const roleY = await cmd.msg.guild.roles.cache.find(role => role.name === `${roleX.name}`);
        cmd.msg.member.roles.add(roleY).then(function() {

            const memberRolesList = memberFSO.roles; //Get member role listing

            //Update FSO with the new role list
            const roleUpdate = {
                $set: {
                    roles: memberRolesList.push(roleY.id)
                }
            };

            fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', roleUpdate, { id: cmd.msg.author.id }).then(done => {
                if (done.modifiedCount === 1) {
                    cmd.channel.send(`${cmd.msg.member} has joined ${roleY}!`);
                }
                else {
                    cmd.reply('Something is...incorrect. Have someone check your roles.');
                }
            });
        }).catch(err => {
            cmd.reply('Something went wrong trying to add your role.\n' + err, 10000);
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
        cmd.reply('No active role to leave!', 10000);
    }
    else {
        //Get role and remove
        const roleY = await cmd.msg.guild.roles.cache.find(role => role.name === `${roleX.name}`);
        cmd.msg.member.roles.remove(roleY).then(function() {
            const memberRolesList = memberFSO.roles; //Get member role listing
            const roleIndex = memberRolesList.indexOf(roleY.id); //Determine role position

            if (roleIndex > -1) { //Remove the role in question
                memberRolesList.splice(roleIndex, 1);
            }

            //Update FSO with the new role list
            const roleUpdate = {
                id: cmd.msg.author.id,
                roles: memberRolesList
            };

            fso_query(fishsticks.FSO_CONNECTION, 'FSO_MemberStats', 'update', roleUpdate)
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
            cmd.reply('Something went wrong trying to remove your role.\n' + err, 10000);
        });
    }
}

//Print the statistics for all roles
async function roleStats(fishsticks, cmd) {
    cmd.reply('Insert neat things here.', 10000);
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
            inactiveRoleList += `**${currentPool[role].name}**: ${currentPool[role].game} (*Requires ${5 - currentPool[role].votes} votes* before ${dateMod.format(currentPool[role].timeout, 'MM D YYYY @ HH:mm')})\n`;
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

    for (const founder in roleObj.founders) {
        const founderMember = await fishsticks.CCG.members.fetch(roleObj.founders[founder]);
        foundersList += `${founderMember.displayName}\n`;
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
        embed: {
            noThumbnail: true
        },
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
                inline: false
            },
            {
                name: 'Founders',
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

    return cmd.channel.send({ embeds: [embedBuilder(roleEmbed)] }).then(sent => {
        setTimeout(() => sent.delete(), 30000);
    });
}

//Activate the role
async function activateRole(fishsticks, cmd, obj) {
    log('info', '[ROLE-SYS] Preparing to activate role...');

    obj.active = true;
    obj.permanent = true;
    obj.activated = systemTimestamp();
    obj.timeout = dateMod.addMonths(obj.timeout, 3);
    obj.timeoutFriendly = flexTime(obj.timeout);

    const roleCount = cmd.msg.guild.roles.cache.length;

    const activateRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', obj);

    if (activateRes.modifiedCount !== 1) {
        throw 'Activation failed!';
    }
    else {
        //Create role
        const newlyCreatedRole = await cmd.msg.guild.roles.create({
            data: {
                name: obj.name,
                color: '#9e876e',
                mentionable: true,
                position: roleCount
            },
            reason: '[ROLE-SYS] Game role subroutine has created a new role based on the votes fo 5 different members.'
        }).then(async newRoleObj => {
            log('proc', `[ROLE-SYS] Created new role ${newRoleObj.name}`);
            cmd.reply('Activation successful!', 10000);

            const updateData = {
                id: obj.id,
                discordID: newRoleObj.id
            };

            await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', updateData);

        });

        //Assign to founders
        for (const indexA in obj.founders) {
            const memberItem = await cmd.msg.guild.members.cache.get(obj.founders[indexA]);
            await memberItem.roles.add(newlyCreatedRole, '[ROLE-SYS] Role added automatically after having voted for it.');
            cmd.channel.send(`${memberItem.displayName} - you've been assigned ${obj.name} because you voted for it!`).then(sent => {
                setTimeout(() => sent.delete(), 10000);
            });
        }
    }
}

//Util Funcs

//Prevent duplicates
function checkDupes(roleObj, cmd) {
    for (const roleItem in currentPool) {
        if (currentPool[roleItem].name === roleObj.name) {
            cmd.reply('This role already exists!', 10000);
            return -1;
        }
        else if (currentPool[roleItem].game === roleObj.name) {
            cmd.reply('*Suspecting sus*; that role name already exists as a game in the listing.', 10000);
            return -2;
        }
        else if (currentPool[roleItem].name === roleObj.game) {
            cmd.reply('There is a role with that game as its name already in the listing!', 10000);
            return -3;
        }
        else if (currentPool[roleItem].game === roleObj.game) {
            cmd.reply('A role with that game already exists!', 10000);
            return -4;
        }
    }

    return 1;
}

//Find a role
async function findRole(fishsticks, extQuery) {

    if (extQuery != null || extQuery !== undefined) {
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
    const curMDN = new Date().setHours(0, 0, 0, 0);

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

//Help
function help() {
    return 'Enables game role controls.';
}