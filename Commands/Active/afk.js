//----AFK----
//Renames the AFK voice chat

//Imports
const chs = require('../../Modules/Core/Core_ids.json');

//Exports
module.exports = {
	run,
	help
};

async function run(fishsticks, cmd) {
    cmd.msg.delete();

    if (cmd.content.length != 3) {
        return cmd.reply('AFK has 3 words...', 10);
    }

    let newName = '';

    if (cmd.content[0].toLowerCase().charAt(0) !== 'a') {
        return cmd.reply('(A)FK - The word needs to start with an A!', 7);
	}
	else if (cmd.content[1].toLowerCase().charAt(0) !== 'f') {
        return cmd.reply('A(F)K - The word needs to start with an F!', 7);
	}
	else if (cmd.content[2].toLowerCase().charAt(0) !== 'k') {
        return cmd.reply('AF(K) - The word needs to start with a K!', 7);
    }

    newName = 'AFK (' + cmd.content.join(' ') + ')';

    const AFKChannel = await fishsticks.channels.cache.get(chs.afkChannel);
    AFKChannel.setName(newName, 'The AFK command was used!')
        .then(cmd.reply('Done!', 10));
}

function help() {
	return 'Changes the AFK channel name';
}