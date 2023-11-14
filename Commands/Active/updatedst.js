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

    shell_conn.on('ready', async () => {
        log('info', '[UPDATE-DST] Shell connection online.');
        int.deferReply();
        await updateLog(fishsticks, '', true);
        shell_conn.exec('./updatedst.sh', (err, stream) => {
            if (err) throw err;
            stream.on('close', async (code, signal) => {
                log('info', `Stream Closed (Code: ${code}) - ${signal}`);
                await updateLog(fishsticks, `[Sys-Shell] [UDST] Stream Closed. (${code} - ${signal})\n`);
                shell_conn.end();
            }).on('data', async (str_data) => {
                log('info', `Console Out: ${str_data}`);
                await updateLog(fishsticks, `${str_data}\n`);
            }).stderr.on('data', async (ste_data) => {
                log('info', `Console Err: ${ste_data}`);
                await updateLog(fishsticks, `${ste_data}\n`);
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

let logMessage;
let logMsgContent;

async function updateLog(fishsticks, logdata, first) {
    if (first) {
        logMsgContent = '[Update DST] Starting an update.\n\n';
        await fishsticks.CONSOLE.send('```[Update DST] Starting an update.```')
            .then(msg => { logMessage = msg; });
    }

    logMsgContent += logdata;
    logMessage.edit(`\`\`\`${logMsgContent}\`\`\``);

    if (logMsgContent.length >= 900) {
        await fishsticks.CONSOLE.send('--')
            .then(msg => { logMessage = msg; });
        logMsgContent = '';
    }
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