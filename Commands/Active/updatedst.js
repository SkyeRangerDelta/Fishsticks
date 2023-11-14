// ---- IPs ----
// Displays a list of CC related game server IPs

//Imports
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client } = require('ssh2');
const { log } = require('../../Modules/Utility/Utils_Log');

//Globals
const data = new SlashCommandBuilder()
    .setName('updatedst')
    .setDescription('Updates the DST server. :D');

//Functions
function run(fishsticks, int) {
    const shell_conn = new Client();

    shell_conn.on('ready', () => {
        log('info', '[UPDATE-DST] Shell connection online.');
        int.deferReply();
        fishsticks.CONSOLE.send('```[Update DST] Starting an update.```');
        shell_conn.exec('./updatedst.sh', (err, stream) => {
            if (err) throw err;
            stream.on('close', (code, signal) => {
                log('info', `Stream Closed (Code: ${code}) - ${signal}`);
                fishsticks.CONSOLE.send(`\`\`\`[Sys-Shell] [UDST] Stream Closed. (${code} - ${signal})\`\`\``);
                shell_conn.end();
            }).on('data', (str_data) => {
                log('info', `Console Out: ${str_data}`);
                fishsticks.CONSOLE.send(`\`\`\`[Sys-Shell] [UDST] Out: ${str_data}\`\`\``);
            }).stderr.on('data', (ste_data) => {
                log('info', `Console Err: ${ste_data}`);
                fishsticks.CONSOLE.send(`\`\`\`[Sys-Shell] [UDST] Err: ${ste_data}\`\`\``);
            });
        });
    }).connect({
        host: process.env.SSH_HOST_HOLO,
        port: process.env.SSH_PORT_HOLO,
        username: process.env.SSH_USER_HOLO,
        password: process.env.SSH_PASS_HOLO
    }).on('close', () => {
        return int.editReply({ content: 'Jobs done.', ephemeral: true });
    }).on('end', () => {
        return int.editReply({ content: 'Jobs done.', ephemeral: true });
    }).on('error', (err) => {
        return int.editReply({ content: `Job errored: ${err}`, ephemeral: true });
    });
}

function help() {
    return 'Updates the DST server.';
}

//Exports
module.exports = {
    name: 'updatedst',
    data,
    run,
    help
};