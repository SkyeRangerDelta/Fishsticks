//----MUTILATE----
//Converts a message into tRiGgEr TeXt

//Exports
module.exports = {
    run,
    help
};

//Functions
function run(fishsticks, cmd) {
    cmd.msg.delete();

    const msgRaw = cmd.content[0];
    const msgToMutilate = msgRaw.split('');

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

    cmd.channel.send(output);

}

function help() {
    return 'Converts text into tRiGgEr TeXt.';
}