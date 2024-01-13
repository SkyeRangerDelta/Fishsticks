// ---- IPs ----
// Displays a list of CC related game server IPs

//Imports
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client } = require('ssh2');
const { log } = require('../../Modules/Utility/Utils_Log');
const { v } = require('../../Modules/Library/emojiList');
const { hasPerms } = require('../../Modules/Utility/Utils_User');

//Globals
const data = new SlashCommandBuilder()
    .setName('updatedst')
    .setDescription('Updates the DST server. :D');

data.addBooleanOption(o => o
    .setName('show-log')
    .setDescription('Enables verbose log in the #fishsticks-console')
);

//Functions
function run(fishsticks, int) {
    if (!hasPerms(int.member, ['Server Manager'])) {
        return int.reply({ content: `You can't do this!`, ephemeral: true });
    }

    const verboseLog = int.options.getBoolean('show-log') || false;
    const shell_conn = new Client();

    shell_conn.on('ready', async () => {
        log('info', '[UPDATE-DST] Shell connection online.');
        int.deferReply();
        await updateLog(fishsticks, '', true);
        shell_conn.exec('./updatedst.sh', (err, stream) => {
            if (err) throw err;
            stream.on('close', async (code, signal) => {
                log('info', `Stream Closed (Code: ${code}) - ${signal}`);
                if (verboseLog) await updateLog(fishsticks, `[Sys-Shell] [UDST] Stream Closed. (${code} - ${signal})\n`);
                shell_conn.end();
            }).on('data', async (str_data) => {
                log('info', `Console Out: ${str_data}`);
                if (verboseLog) await updateLog(fishsticks, `${str_data}\n`);
            }).stderr.on('data', async (ste_data) => {
                log('info', `Console Err: ${ste_data}`);
                if (verboseLog) await updateLog(fishsticks, `${ste_data}\n`);
            });
        });
    }).connect({
        host: process.env.SSH_HOST_HOLO,
        port: process.env.SSH_PORT_HOLO,
        username: process.env.SSH_USER_HOLO,
        password: process.env.SSH_PASS_HOLO
    }).on('close', () => {
        fishsticks.CONSOLE.send('```[Update DST] Update done. (Console closed)```');
        return int.editReply({ content: `Job's done.`, ephemeral: true });
    }).on('end', () => {
        fishsticks.CONSOLE.send('```[Update DST] Update done. (Shell exited)```');
        return int.editReply({ content: `Job's completed.`, ephemeral: true });
    }).on('error', (err) => {
        fishsticks.CONSOLE.send('```[Update DST] Update errored! (Console error reported)```');
        return int.editReply({ content: `Job errored: ${err}`, ephemeral: true });
    });
}

let logMessage;
let logMsgContent;

async function updateLog(fishsticks, logdata, first) {
    if (first) {
        logMsgContent = '[Update DST] Running an update.\n\n';
        await fishsticks.CONSOLE.send('```[Update DST] Running an update.```')
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