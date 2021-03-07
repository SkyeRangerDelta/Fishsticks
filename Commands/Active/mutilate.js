//----MUTILATE----
//Converts a message into tRiGgEr TeXt

//Exports
module.exports = {
    run,
    help
};

//Functions
function run(fishsticks, cmd) {
    cmd.msg.delete({ timeout: 0 });

    const rawInput = cmd.join(' ');
    const msgToMutilate = rawInput.split('');

    const outputArr = [];

    for (const character in msgToMutilate) {
        if (character % 2 == 0) {
            outputArr.push(msgToMutilate[character].toUpperCase());
        }
        else {
            outputArr.push(msgToMutilate[character].toLowerCase());
        }
    }

    const output = outputArr.join('');

    cmd.msg.channel.send(output);

}

function help() {
    return 'Converts text into tRiGgEr TeXt.';
}