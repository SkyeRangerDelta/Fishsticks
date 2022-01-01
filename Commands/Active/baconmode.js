//----BaconMode----

//Exports
module.exports = {
	run,
	help
};

function run(fishsticks, cmd) {
    cmd.msg.delete();

    //Collect target
    const target = cmd.msg.mentions.members.first();

    //Validate
    if (!target) {
        console.log('[BAC-MODE] Target found to be null.');
        cmd.reply('Cleared the bacon target.', 10);

        return fishsticks.baconTarget = null;
    }

    //Set target global
    try {
        fishsticks.baconTarget = target.id;
	}
	catch (error) {
        throw 'Bacon mode failed to engage.';
    }

    cmd.reply('Bacon mode engaged!', 10);

}

function help() {
	return 'Enables BaconMode';
}