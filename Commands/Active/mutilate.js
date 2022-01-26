//----MUTILATE----
//Converts a message into tRiGgEr TeXt

//Imports
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('mutilate')
    .setDescription('Mutilate some text.');

data.addStringOption(o => o.setName('text').setDescription('The text to mutilate.').setRequired(true));

//Functions
function run(fishsticks, int) {
    const msgRaw = int.options.getString('text');

    const msgToMutilate = msgRaw.split('');

    const outputArr = [];

    for (const character in msgToMutilate) {
        if (character % 2 === 0) {
            outputArr.push(msgToMutilate[character].toUpperCase());
        }
        else {
            outputArr.push(msgToMutilate[character].toLowerCase());
        }
    }

    const output = outputArr.join('');

    int.channel.send(output);
    int.reply({ content: 'Sent!', ephemeral: true });

}

function help() {
    return 'Converts text into tRiGgEr TeXt.';
}

//Exports
module.exports = {
    name: 'mutilate',
    data,
    run,
    help
};