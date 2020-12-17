//------GAME ROLE SUBROUTINE-------
//=================================

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { systemTimestamp } = require('../../Modules/Utility/Utils_Time');

const { DuplicatedRoleException } = require('../../Modules/Errors/DuplicatedRoleException');
const { InvalidParameterException } = require('../../Modules/Errors/InvalidParameterException');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');

//Exports
module.exports = {
    run,
    help
};

//Globals
let currentPool;
let params = null;

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 10000 });

    params = cmd.content;

    //Obtain a current set of roles in array for future use
    const queryRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Roles', 'selectAll');

    //Parse the query
    parseRequest(fishsticks, cmd, queryRes);

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
async function parseRequest(fishsticks, cmd, poolRes) {
    //Validate func
    if (!params[0] || params[0] === null) {
        throw 'What am I going to do with you. You need to specify what your intentions are.';
    }

    //Do pool gen
    currentPool = await poolRes.toArray();

    if (params[0] == 'n' || params[0] == 'new') {
        log('info', '[ROLE-SYS] Creating a new role.');

        //Validate all required parameters existence
        if (!params[1] || params[1] === null) {
            throw 'A capital choice. A new role with no name. Fantastic.';
        }
        if (!params[2] || params[2] === null) {
            throw 'Why are you the way that you are? I need a game name to go with the role.';
        }
        if (!params[3] || params[3] === null) {
            throw 'For the sake of knowing what people are getting into, perhaps it would be conducive to add a description to the neew role.';
        }

        //Begin new role listing
        newRole(fishsticks, cmd).catch(e => {
            log('warn', `[ROLE-SYS] ${e.name} : ${e.message}`);
        });
    }
    else if (params[0] == 'e' || params[0] == 'edit') {
        log('info', '[ROLE-SYS] Editing a role.');

        //!role -edit -ID -param -new value

        //Validate all required parameters existence
        editRole(fishsticks, cmd);
    }
    else if (params[0] == 'v' || params[0] == 'vote') {
        log('info', '[ROLE-SYS] Voting for a role.');

        voteRole(fishsticks, cmd).catch(e => {
            log('warn', `[ROLE-SYS] ${e.message}`);
        });
    }
    else if (params[0] == 'j' || params[0] == 'join') {
        log('info', '[ROLE-SYS] Joining a role.');

        joinRole(fishsticks, cmd);
    }
    else if (params[0] == 'l' || params[0] == 'leave') {
        log('info', '[ROLE-SYS] Leaving a role.');

        leaveRole(fishsticks, cmd);
    }
    else if (params[0] == 's' || params[0] == 'stats') {
        log('info', '[ROLE-SYS] Getting the statistics for a role.');

        roleStats(fishsticks, cmd);
    }
    else if (params[0] == 'list') {
        log('info', '[ROLE-SYS] Listing roles.');

        listRoles(fishsticks, cmd);
    }
    else if (params[0] == 'show') {
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

    //Create role Obj
    const newRoleObj = {
        name: toTitleCase(params[1]),
        creator: cmd.msg.member.displayName,
        game: toTitleCase(params[2]),
        description: params[3],
        created: systemTimestamp(),
        activated: null,
        pings: 0,
        votes: 1,
        founders: [cmd.msg.author.id],
        members: [],
        active: false,
        activityFactor: 0
    };

    //Verify not duplicate
    const dupeCheck = checkDupes(newRoleObj, cmd);
    if (dupeCheck != 1) {
        throw new DuplicatedRoleException(dupeCheck);
    }

    //Add role to the listings
    const addRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Roles', 'insert', newRoleObj);
    if (addRes.inserted != 1) {
        throw 'Something went wrong adding the role to the listings...';
    }
    else {
        cmd.msg.reply('Role listed!');
    }
}

//Edit a role
async function editRole(fishsticks, cmd) {
    cmd.msg.reply('Insert neat things here.').then(sent => sent.delete({ timeout: 10000 }));
}

//Vote for a role
async function voteRole(fishsticks, cmd) {
    cmd.msg.reply('Insert neat things here.').then(sent => sent.delete({ timeout: 10000 }));

    const roleObj = findRole();

    if (roleObj == -1) {
        throw 'That role doesnt exist!';
    }
    else if (roleObj.votes >= 5) {
        return cmd.msg.reply('This role has already been officialized, assigning it instead...').then(sent => sent.delete({ timeout: 10000 }));
    }
    else {

        for (const memID in roleObj.founders) {
            if (roleObj.founders[memID] == cmd.msg.author.id) {
                return cmd.msg.reply('You already voted for this role! Get outta here!').then(sent => sent.delete({ timeout: 10000 }));
            }
        }

        const updateObj = {
            id: roleObj.id,
            votes: roleObj.votes + 1,
            founders: roleObj.founders
        };

        updateObj.founders.push(cmd.msg.author.id);

        if (updateObj.votes == 5) {
            activateRole(fishsticks, cmd, updateObj);
        }
        else {
            const updateRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Roles', 'update', updateObj);

            if (updateRes.replaced != 1) {
                throw 'Role update in FSO failed!';
            }
            else {
                const missingVotes = 5 - updateObj.votes;

                cmd.msg.reply(`Vote counted; ${roleObj.name} requires ${missingVotes} vote(s) before being activated!`).then(sent => sent.delete({ timeout: 10000 }));
            }
        }
    }
}

//Join a role
async function joinRole(fishsticks, cmd) {
    cmd.msg.reply('Insert neat things here.').then(sent => sent.delete({ timeout: 10000 }));
}

//Leave a role
async function leaveRole(fishsticks, cmd) {
    cmd.msg.reply('Insert neat things here.').then(sent => sent.delete({ timeout: 10000 }));
}

//Print the statistics for all roles
async function roleStats(fishsticks, cmd) {
    cmd.msg.reply('Insert neat things here.').then(sent => sent.delete({ timeout: 10000 }));
}

//List all roles
async function listRoles(fishsticks, cmd) {
    cmd.msg.reply('Insert neat things here.').then(sent => sent.delete({ timeout: 10000 }));
}

//Print the stats for a single role
async function aboutRole(fishsticks, cmd) {
    cmd.msg.reply('Insert neat things here.').then(sent => sent.delete({ timeout: 10000 }));

    const roleObj = await findRole();
    let activeField;

    console.log(roleObj);

    if (roleObj.active) {
        activeField = {
            title: 'Activated On',
            description: roleObj.activated,
            inline: true
        };
    }
    else {
        activeField = {
            title: 'Votes',
            description: roleObj.votes,
            inline: true
        };
    }

    let foundersList = '';
    let membersList = '';

    for (const founder in roleObj.founders) {
        const founderMember = await fishsticks.CCG.members.fetch(roleObj.founders[founder]);
        foundersList += `${founderMember.displayName}\n`;
    }

    if (roleObj.members.length == 0) {
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
                title: 'Creator',
                description: roleObj.creator,
                inline: true
            },
            {
                title: 'Game',
                description: roleObj.game,
                inline: true
            },
            {
                title: 'Created On',
                description: roleObj.created,
                inline: true
            },
            {
                title: 'Active?',
                description: roleObj.active,
                inline: true
            },
            activeField,
            {
                title: 'Actitivity Factor',
                description: roleObj.activityFactor,
                inline: true
            },
            {
                title: 'Pings',
                description: roleObj.pings,
                inline: false
            },
            {
                title: 'Founders',
                description: foundersList,
                inline: true
            },
            {
                title: 'Members',
                description: membersList,
                inline: true
            }
        ],
        delete: 30000
    };

    return cmd.msg.channel.send({ embed: embedBuilder(roleEmbed) }).then(sent => sent.delete({ timeout: 30000 }));
}

//Activate the role
async function activateRole(fishsticks, cmd, obj) {
    log('info', '[ROLE-SYS] Preparing to activate role...');

    obj.active = true;
    obj.activated = systemTimestamp();

    const activateRes = await fso_query(fishsticks.FSO_CONNECTION, 'Fs_Roles', 'update', obj);

    if (activateRes.replaced != 1) {
        throw 'Activation failed!';
    }
    else {
        cmd.msg.reply('Activation successful!').then(sent => sent.delete({ timeout: 10000 }));
        //Create role

        //Assign to founders
    }
}

//Util Funcs

//Prevent duplicates
function checkDupes(roleObj, cmd) {
    for (const roleItem in currentPool) {
        if (currentPool[roleItem].name == roleObj.name) {
            cmd.msg.reply('This role already exists!').then(sent => sent.delete({ timeout: 10000 }));
            return -1;
        }
        else if (currentPool[roleItem].game == roleObj.name) {
            cmd.msg.reply('*Suspecting sus*; that role name already exists as a game in the listing.').then(sent => sent.delete({ timeout: 10000 }));
            return -2;
        }
        else if (currentPool[roleItem].name == roleObj.game) {
            cmd.msg.reply('There is a role with that game as its name already in the listing!').then(sent => sent.delete({ timeout: 10000 }));
            return -3;
        }
        else if (currentPool[roleItem].game == roleObj.game) {
            cmd.msg.reply('A role with that game already exists!').then(sent => sent.delete({ timeout: 10000 }));
            return -4;
        }
    }

    return 1;
}

//Find a role
function findRole() {
    if (!params[1] || params[1] === null) {
        throw new InvalidParameterException('No name or game was supplied!');
    }

    const query = toTitleCase(params[1]);

    for (const roleItem in currentPool) {
        if (query == currentPool[roleItem].name) {
            log('proc', '[ROLE-SYS] Found a role.');
            return currentPool[roleItem];
        }
        else if (query == currentPool[roleItem].game) {
            log('proc', '[ROLE-SYS] Found a role.');
            return currentPool[roleItem];
        }
    }

    return -1;
}

//Convert to title case
function toTitleCase(toConvert) {
    let breakupArr = toConvert.split(' ');

    for (const breakupEle in breakupArr) {
        const tempLetter = breakupArr[breakupEle].charAt(0).toUpperCase();
        breakupArr[breakupEle] = tempLetter + breakupArr[breakupEle].substring(1, breakupArr[breakupEle].length);
    }

    breakupArr = breakupArr.join(' ');

    log('info', '[ROLE-SYS] Converted title to: ' + breakupArr);

    return breakupArr;
}

//Help
function help() {
    return 'Enables game role controls.';
}