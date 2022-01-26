// ---- LAUNCH ----
//Launch a nuke if you've got the proper code

//Imports
const { SlashCommandBuilder } = require('@discordjs/builders');

//Globals
const data = new SlashCommandBuilder()
    .setName('launch')
    .setDescription('Launch a nuke.');

data.addSubcommand(s =>
    s
        .setName('rules')
        .setDescription('Prints out the keyset rules.')
);

//Functions
async function run(fishsticks, int) {
    if (int.options.getSubcommand() === 'rules') {
        return int.reply('Code extraction rules are as follows:\n-The code is extracted from the keyset of 3 sets of 7 randomized letters and numbers.\n-The code can simply be entered into chat without re-using `!launch`.\n-The code follows this format: 3,4-3,4,5-4,5 from the keyset.\n-ie: Given keyset 2J|71|DCK-VH|72C|VO-UGH|V7|BU; the code is 7172CV7.');
    }

    //Generate 3 sets of 7 characters
    const fullkey = `${genSet()}-${genSet()}-${genSet()}`;

    //3-4, 3-5, 4-5
    const code = codeSet(fullkey);

    const filterData = (res) => res.author.id === cmd.msg.author.id;

    int.reply('Input your launch code. You have 60 seconds.\nKeyset: ' + fullkey)
        .then(() => {
            int.channel.awaitMessages({ filter: filterData, max: 1, time: 60000, errors: ['time'] }).then(msg => {
                console.log(msg.first().content);
                if (msg.first().content === code) {
                    const sites = ['MS-17', 'MS-23', 'MS-35', 'TK-11', 'SMS-12', 'FORTNER', 'FS', 'ALBEDO', 'KOALA', 'ANKER'];
                    const destinations = ['Moscow, Russia', 'Beijing, China', 'Kabul, Afghanistan', 'Atlanta, GA', 'Tehran, Iran', 'Baghdad, Iraq', 'Tripoli, Libya', 'Kyiv, Ukraine', 'New Dheli, India', 'Damascus, Syria', 'The Antarctic', 'Panama City, Panama', 'Bogota, Columbia'];

                    const siteMath = Math.floor(Math.random() * sites.length);
                    const destMath = Math.floor(Math.random() * destinations.length);

                    return int.followUp('Code accepted. Launching nuclear ICBM from site `' + sites[siteMath] + '` to destination `' + destinations[destMath] + '`' + `. I hope you know what you're doing.`);
                }
                else {
                    return int.followUp('Unknown code - this instance has been reported.');
                }


            });
        });

}

function help() {
    return 'Launch a nuke.';
}

//Generate random 7 character keyset
function genSet() {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let keyset = '';
    for (let i = 0; i <= 6; i++) {
        keyset += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return keyset;
}

//Extract code from full keyset
function codeSet(key) {
    let code = '';

    code += key.substring(2, 4);
    code += key.substring(10, 13);
    code += key.substring(19, 21);

    return code;
}

//Exports
module.exports = {
    name: 'launch',
    data,
    run,
    help
};