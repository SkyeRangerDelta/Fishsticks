// ---- LAUNCH ----
//Launch a nuke if you've got the proper code

//Exports
module.exports = {
    run,
    help
};

//Functions
async function run(fishsticks, cmd) {
    cmd.msg.delete();

    if (cmd.content[0] === 'rules') {
        return cmd.reply('Ill add these eventually.');
    }

    //Generate 3 sets of 7 characters
    const fullkey = `${genSet()}-${genSet()}-${genSet()}`;

    //3-4, 3-5, 4-5
    const code = codeSet(fullkey);

    const filterData = (res) => res.author.id === cmd.msg.author.id;

    cmd.channel.send('Input your launch code. You have 60 seconds.\nKeyset: ' + fullkey)
        .then(() => {
            cmd.channel.awaitMessages({ filter: filterData, max: 1, time: 60000, errors: ['time'] }).then(msg => {
                console.log(msg.first().content);
                if (msg.first().content === code) {
                    const sites = ['MS-17', 'MS-23', 'MS-35', 'TK-11', 'SMS-12', 'FORTNER', 'FS', 'ALBEDO', 'KOALA', 'ANKER'];
                    const destinations = ['Moscow, Russia', 'Beijing, China', 'Kabul, Afghanistan', 'Atlanta, GA', 'Tehran, Iran', 'Baghdad, Iraq', 'Tripoli, Libya', 'Kyiv, Ukraine', 'New Dheli, India', 'Damascus, Syria', 'The Antarctic', 'Panama City, Panama', 'Bogota, Columbia'];

                    const siteMath = Math.floor(Math.random() * sites.length);
                    const destMath = Math.floor(Math.random() * destinations.length);

                    return cmd.reply('Code accepted. Launching nuclear ICBM from site `' + sites[siteMath] + '` to destination `' + destinations[destMath] + '`' + `. I hope you know what you're doing.`);
                }
                else {
                    return cmd.reply('Unknown code - this instance has been reported.');
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