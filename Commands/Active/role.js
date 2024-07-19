//------GAME ROLE SUBROUTINE-------
//=================================

//Imports
const { fso_query } = require('../../Modules/FSO/FSO_Utils');
const { log } = require('../../Modules/Utility/Utils_Log');
const { embedBuilder } = require('../../Modules/Utility/Utils_EmbedBuilder');
const { toTitleCase } = require('../../Modules/Utility/Utils_Aux');

const { DuplicatedRoleException } = require('../../Modules/Errors/DuplicatedRoleException');

const { DateTime } = require('luxon');
const { hasPerms } = require('../../Modules/Utility/Utils_User');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { flexTime } = require('../../Modules/Utility/Utils_Time');

//Globals
let currentPool;
const curMDN = DateTime.now().setZone('UTC-5');
let roleTitle = null;
let subCMD;

//Syntax: /role function data
//Create: /role create roleName roleGame description
//Join: /role join
//Leave: /role leave
//Vote: /role vote
//Edit: /role edit
//Detail: /role details

const data = new SlashCommandBuilder()
  .setName('role')
  .setDescription('Handles role-specific functions');

data.addSubcommand(s => s
  .setName('create')
  .setDescription('Allows the creation of a new role.')
  .addStringOption(o => o
    .setName('role-name')
    .setDescription('The name of the role (shown on ping).')
    .setRequired(true))
  .addStringOption(o => o
    .setName('role-game')
    .setDescription('The name of the game this role is associated with.')
    .setRequired(true)
  )
  .addStringOption(o => o
    .setName('role-desc')
    .setDescription('A description of the game/role.')
    .setRequired(true)
  ));

data.addSubcommand(s => s
  .setName('join')
  .setDescription('Joins a role')
  .addRoleOption(o => o
    .setName('role')
    .setDescription('The role to join.')
    .setRequired(true)));

data.addSubcommand(s => s
  .setName('leave')
  .setDescription('Leaves a role')
  .addRoleOption(o => o
    .setName('role')
    .setDescription('The role to leave.')
    .setRequired(true)));

data.addSubcommand(s => s
  .setName('vote')
  .setDescription('Votes for a role')
  .addStringOption(o => o
    .setName('role')
    .setDescription('The name or the game of the role to vote for.')
    .setRequired(true)));

data.addSubcommand(s => s
  .setName('edit')
  .setDescription('Edits a role'));

data.addSubcommand(s => s
  .setName('details')
  .setDescription('Displays some details for a role')
  .addRoleOption(o => o
    .setName('role')
    .setDescription('The role to pull up details for.')
    .setRequired(true)));

data.addSubcommand(s => s
  .setName('list')
  .setDescription('Lists all game roles.')
);

//Functions
async function run(fishsticks, int) {
  //return int.reply({ content: 'This thing is mad busted right now...so just...dont try for now. Nothing works, Im sorry.', ephemeral: true });
  //int.deferReply();

  subCMD = int.options.getSubcommand();

  //Obtain a current set of roles in array for future use
  const queryRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'selectAll');

  //Recalibrate time indexes and perform table maintenance
  await updateRoles(fishsticks, queryRes);

  //Parse the query
  parseRequest(fishsticks, int, queryRes).catch(e => {
    int.reply({ content: '*Ok but why.*\n' + e });
  });

  //Syntax: /role function data
  //Create: /role create roleName roleGame description
  //Join: /role join
  //Leave: /role leave
  //Vote: /role vote
  //Edit: /role edit
  //Detail: /role details

}
async function parseRequest(fishsticks, int) {

  switch (subCMD) {
    case 'create':
      await newRole(fishsticks, int);
      break;

    case 'join':
      await joinRole(fishsticks, int);
      break;

    case 'leave':
      await leaveRole(fishsticks, int);
      break;

    case 'vote':
      await voteRole(fishsticks, int);
      break;

    case 'edit':
      await editRole(fishsticks, int);
      break;

    case 'details':
      await detailsRole(fishsticks, int);
      break;

    case 'list':
      await listRoles(fishsticks, int);
      break;

    default:
      int.reply({ content: 'I honestly have no idea how you got here. Im impressed. Somehow you got around using a subcommand, please specify one.', ephemeral: true });
  }
}

//Create a new role
async function newRole(fishsticks, int) {
  //Assume !role -new -name -game -description

  const curFlexTime = flexTime();
  const roleTimeout = curMDN.plus({ 'weeks': 2 });

  const rName = int.options.getString('role-name');
  const rGame = int.options.getString('role-game');
  const rDesc = int.options.getString('role-desc');

  //Create role Obj
  const newRoleObj = {
    name: rName,
    creator: int.member.displayName,
    game: rGame,
    description: rDesc,
    created: curMDN,
    createdFriendly: curFlexTime,
    activated: null,
    timeout: roleTimeout,
    timeoutFriendly: roleTimeout.toLocaleString(DateTime.DATETIME_MED),
    pings: 0,
    votes: 1,
    founders: [int.member.id],
    members: [],
    active: false,
    permanent: false,
    activityFactor: 0
  };

  //Verify not duplicate
  const dupeCheck = checkDupes(newRoleObj, int);
  if (dupeCheck !== 1) {
    throw new DuplicatedRoleException(dupeCheck);
  }

  //Add role to the listings
  const addRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'insert', newRoleObj);
  if (addRes.acknowledged === true) {
    int.reply({ content: 'Role listed.', ephemeral: true });
  }
  else {
    throw 'Something went wrong adding the role to the listings...';
  }
}

//Edit a role
async function editRole(fishsticks, int) {
  int.reply({ content: 'WIP. Not ready yet.', ephemeral: true });
}

//Vote for a role
async function voteRole(fishsticks, int, redirectData) {

  //If redirect from join, use already existing role process
  let roleObj;

  if (!redirectData) {
    roleObj = await findRole(fishsticks, int);

    if (roleObj === -1) {
      throw 'That role doesnt exist!';
    }
  }
  else {
    roleObj = redirectData;
  }


  if (roleObj.votes >= 5) {
    int.reply({ content: 'This role has already been officialized, assigning it instead...', ephemeral: true });
    return joinRole(fishsticks, int, roleObj);
  }
  else {
    //Run through founders to prevent dupe
    for (const memID in roleObj.founders) {
      if (roleObj.founders[memID] === int.member.id) {
        return int.reply({ content: 'You already voted for this role! Get outta here!', ephemeral: true });
      }
    }

    //Determine new timeout in ms
    const timeDiff = curMDN.plus({ 'weeks': 2 });

    const updateObj = {
      $inc: {
        votes: 1
      },
      $push: {
        founders: int.member.id
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
      await activateRole(fishsticks, int, roleObj);
    }
    else {
      const secondUpdate = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'select', { name: roleObj.name });
      const missingVotes = 5 - secondUpdate.votes;

      int.reply({ content: `Vote counted; ${roleObj.name} requires ${missingVotes} vote(s) before being activated!`, ephemeral: true });
    }
  }
}

//Join a role
async function joinRole(fishsticks, int, redirectData) {
  //Check active
  let roleObj;

  if (!redirectData) {
    roleObj = await findRole(fishsticks, int);
  }
  else {
    //Redirect from vote
    roleObj = redirectData;
  }

  //Get role and add
  const intRole = int.options.getRole('role');
  const roleY = await int.guild.roles.cache.find(role => role.name === `${intRole.name}`);

  //Check if this person already has the role
  if (hasPerms(int.member, [`${roleObj.name}`])) {
    return int.reply({ content: 'You already have this role!', ephemeral: true });
  }

  // Check if this is a game role
  if (roleY.color === '#9e876e') {
    return int.reply({ content: 'This isn\'t a game role, you can\'t join it!' });
  }

  await int.member.roles.add(roleY).then(function() {

    /*
    //Update FSO with the new role list
    const roleUpdate = {
        $push: {
            members: int.member.id
        }
    };

    fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', roleUpdate, { id: roleObj.id }).then(done => {
        if (done.modifiedCount === 1) {
            int.channel.send(`${int.member} has joined ${roleY}!`);
        }
        else {
            int.reply({ content: 'Something is...incorrect. Have someone check your roles.', ephemeral: true });
        }
    });
     */
    return int.reply(`${int.member} has joined ${roleY}!`);
  }).catch(err => {
    log('err', '[ROLE-SYS] [JOIN] Error:\n' + err.stack);
    return int.reply({ content: 'Something went wrong trying to add your role.\n' + err, ephemeral: true });
  });
}
//

//Leave a role
async function leaveRole(fishsticks, int) {
  //Check active
  const roleX = int.options.getRole('role');
  if (roleX.active === false) {
    //Vote role override
    int.reply({ content: 'No active role to leave!', ephemeral: true });
  }
  else {
    //Get role and remove
    const roleY = await int.guild.roles.cache.find(role => role.name === `${roleX.name}`);

    //Check if this person already has left the role
    if (!hasPerms(int.member, [`${roleX.name}`])) {
      return int.reply({ content: 'You already have left this role!', ephemeral: true });
    }

    int.member.roles.remove(roleY).then(function() {

      /*
      const roleUpdate = {
          $pull: {
              members: `${int.member.id}`
          }
      };

      fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'update', roleUpdate, { id: int.member.id })
          .then(done => {
          if (done.modifiedCount === 1) {
              return int.reply({ content: 'Role removed.', ephemeral: true });
          }
          else {
              return int.reply({ content: 'Something is...incorrect. Have someone check your roles.', ephemeral: true });
          }
      });
       */
      return int.reply({ content: 'Role removed.', ephemeral: true });
    }).catch(err => {
      return int.reply({ content: 'Something went wrong trying to remove your role.\n' + err, ephemeral: true });
    });
  }
}

//List all roles
async function listRoles(fishsticks, int, ext) {

  if (ext) { //External inquiry, update role listing
    log('info', '[ROLE-SYS] External query requested role listing.');
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
    footer: {
      text: 'Active role listings pulled from FSO.'
    }
  };

  const inactiveListEmbed = {
    title: 'o0o - Role Listing [Inactive] - o0o',
    description: inactiveRoleList,
    delete: 45000,
    footer: {
      text: 'Inactive role listings pulled from FSO.'
    }
  };

  await int.channel.send({ embeds: [embedBuilder(roleListEmbed)] }).then(sent => {
    setTimeout(() => sent.delete(), 45000);
    int.channel.send({ embeds: [embedBuilder(inactiveListEmbed)] }).then(sent2 => {
      setTimeout(() => sent2.delete(), 45000);
    });
  });

  if (ext) {
    return int.editReply({ content: 'Done.', ephemeral: true });
  }
  else {
    return int.reply({ content: 'Done.', ephemeral: true });
  }
}

//Print the stats for a single role
async function detailsRole(fishsticks, int) {
  return int.reply({ content: 'WIP. Not ready yet.', ephemeral: true });
  const roleObj = await findRole(fishsticks, int);

  if(!roleObj || roleObj === -1) {
    return int.reply({ content: 'No role found!', ephemeral: true });
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
    footer: {
      text: `Summoned by ${int.member.displayName}.`
    },
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

  return int.reply({ content: 'Role info.', embeds: [embedBuilder(roleEmbed)] });
}

//Activate the role
async function activateRole(fishsticks, int, obj) {
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
      int.reply({ content: 'Activation successful!', ephemeral: true });

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
        int.channel.send(`${memberItem.displayName} - you've been assigned ${roleData.name} because you voted for it!`).then(sent => {
          setTimeout(() => sent.delete(), 15000);
        });
      }
    });
  }
  catch (roleCreateErr) {
    log('err', '[ROLE-SYS] Error creating the role!\n' + roleCreateErr);
  }
}

//Util Funcs

//Prevent duplicates
function checkDupes(roleObj, int) {
  for (const roleItem in currentPool) {
    if (currentPool[roleItem].name === roleObj.name) {
      int.reply('This role already exists!');
      return -1;
    }
    else if (currentPool[roleItem].game === roleObj.name) {
      int.reply({ content: '*Suspecting sus*; that role name already exists as a game in the listing.', ephemeral: true });
      return -2;
    }
    else if (currentPool[roleItem].name === roleObj.game) {
      int.reply({ content: 'There is a role with that game as its name already in the listing!', ephemeral: true });
      return -3;
    }
    else if (currentPool[roleItem].game === roleObj.game) {
      int.reply({ content: 'A role with that game already exists!', ephemeral: true });
      return -4;
    }
  }

  return 1;
}

//Find a role
async function findRole(fishsticks, int) {
  log('info', '[ROLE-SYS] Returning role object.');
  //Internal query
  if (subCMD === 'vote') {
    roleTitle = int.options.getString('role').toLowerCase();

    for (const roleItem in currentPool) {
      if (roleTitle === currentPool[roleItem].name.toLowerCase()) {
        log('proc', '[ROLE-SYS] Found a role.');
        return currentPool[roleItem];
      }
      else if (roleTitle === currentPool[roleItem].game.toLowerCase()) {
        log('proc', '[ROLE-SYS] Found a role.');
        return currentPool[roleItem];
      }
    }
  }
  else {
    roleTitle = int.options.getRole('role').name;

    for (const roleItem in currentPool) {
      if (roleTitle === currentPool[roleItem].name) {
        log('proc', '[ROLE-SYS] Found a role.');
        return currentPool[roleItem];
      }
      else if (roleTitle === currentPool[roleItem].game) {
        log('proc', '[ROLE-SYS] Found a role.');
        return currentPool[roleItem];
      }
    }
  }

  return -1;
}

async function queryForRole(fishsticks, extQuery) {
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

//Delete a role (SYSTEM ONLY)
async function delRole(fishsticks, id, expired) {
  let delRes;
  if (expired) {
    delRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'delete', {
      name: id
    });

    if (delRes.deletedCount !== 1) {
      log('err', '[ROLE-SYS] Failed to delete role.');
    }
    else {
      log('proc', '[ROLE-SYS] Deleted role with name: ' + id);
      const queryResA = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'selectAll');
      await updateRoles(fishsticks, queryResA);
    }
  }
  else {
    delRes = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'delete', id);

    if (delRes.deletedCount !== 1) {
      log('err', '[ROLE-SYS] Failed to delete role.');
    }
    else {
      log('proc', '[ROLE-SYS] Deleted role with id: ' + id);
      const queryResA = await fso_query(fishsticks.FSO_CONNECTION, 'FSO_Roles', 'selectAll');
      await updateRoles(fishsticks, queryResA);
    }
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
        await delRole(fishsticks, currentPool[roleObj].name, true);
      }
    }
  }
}


//Help
function help() {
  return 'Enables game role controls.';
}

//Exports
module.exports = {
  name: 'role',
  data,
  run,
  help,
  findRole,
  listRoles
};