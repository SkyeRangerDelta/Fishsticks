//----MUTILATE----

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let rawInput = cmd.join(' ');
    let msgToMutilate = rawInput.split('');

    console.log("rawInput: " + rawInput);
    console.log("msgToMutilate: " + msgToMutilate);

    let outputArr = [];

    for (character in msgToMutilate) {
        if (character % 2 == 0) {
            outputArr.push(msgToMutilate[character].toUpperCase());
        } else {
            outputArr.push(msgToMutilate[character].toLowerCase());
        }
    }

    let output = outputArr.join('');
    
    msg.channel.send(output);

}