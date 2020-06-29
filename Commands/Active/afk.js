//----AFK----

//Imports
const chs = require('../../Modules/Core/Core_ids.json');

//Exports
module.exports = {
	run,
	help
};

async function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    if (cmd.length != 3) {
        return cmd.msg.reply('AFK has 3 words...').then(sent => sent.delete({ timeout: 10000 }));
    }

    let newName = '';

    if (cmd[0].toLowerCase().charAt(0) != 'a') {
        return cmd.msg.reply('(A)FK - The word needs to start with an A!').then(sent => sent.delete({ timeout: 7000 }));
	}
	else if (cmd[1].toLowerCase().charAt(0) != 'f') {
        return cmd.msg.reply('A(F)K - The word needs to start with an F!').then(sent => sent.delete({ timeout: 7000 }));
	}
	else if (cmd[2].toLowerCase().charAt(0) != 'k') {
        return cmd.msg.reply('AF(K) - The word needs to start with a K!').then(sent => sent.delete({ timeout: 7000 }));
    }

    newName = 'AFK (' + cmd.join(' ') + ')';

    const AFKChannel = await fishsticks.channels.cache.get(chs.afkChannel);
    AFKChannel.setName(newName, 'The AFK command was used!').then(
		cmd.msg.reply('Done!').then(sent => {
			sent.delete({ timeout: 10000 });
		})
	);
}

function help() {
	return 'Changes the AFK channel name';
}