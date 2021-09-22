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
    cmd.msg.delete({ timeout: 0 });

    if (cmd.content.length != 3) {
        return cmd.msg.reply({ content: 'AFK has 3 words...' })
            .then(sent => sent.delete({ timeout: 10000 }));
    }

    let newName = '';

    if (cmd.content[0].toLowerCase().charAt(0) != 'a') {
        return cmd.msg.reply({ content: '(A)FK - The word needs to start with an A!' })
            .then(sent => sent.delete({ timeout: 7000 }));
	}
	else if (cmd.content[1].toLowerCase().charAt(0) != 'f') {
        return cmd.msg.reply({ content: 'A(F)K - The word needs to start with an F!' })
            .then(sent => sent.delete({ timeout: 7000 }));
	}
	else if (cmd.content[2].toLowerCase().charAt(0) != 'k') {
        return cmd.msg.reply({ content: 'AF(K) - The word needs to start with a K!' })
            .then(sent => sent.delete({ timeout: 7000 }));
    }

    newName = 'AFK (' + cmd.content.join(' ') + ')';

    const AFKChannel = await fishsticks.channels.cache.get(chs.afkChannel);
    AFKChannel.setName(newName, 'The AFK command was used!').then(
		cmd.msg.reply({ content: 'Done!' })
            .then(sent => {
                sent.delete({ timeout: 10000 });
		})
	);
}

function help() {
	return 'Changes the AFK channel name';
}