//----BaconMode----

//Exports
module.exports = {
	run,
	help
};

function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    //Collect target
    const target = cmd.msg.mentions.users.first();

    //Validate
    if (!target || target == null || target == undefined) {
        console.log('[BAC-MODE] Target found to be null.');
        cmd.msg.reply({ content: 'Clearing the bacon target.' })
            .then(sent => sent.delete({ timeout: 10000 }));

        return fishsticks.baconTarget = null;
    }

    //Set target global
    try {
        fishsticks.baconTarget = target;
	}
	catch (error) {
        throw 'Bacon mode failed to engage.';
    }

    cmd.msg.reply({ content: 'Bacon mode engaged!' })
        .then(sent => sent.delete({ timeout: 10000 }));

}

function help() {
	return 'Enables BaconMode';
}