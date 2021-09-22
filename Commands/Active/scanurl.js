// ---- ScanURL ----
//Tests a URL for malicious stuff

//Imports
const extURL = require('extract-urls');
const { validateURL } = require('../../Modules/Utility/Utils_Aux');
const { log } = require('../../Modules/Utility/Utils_Log');

module.exports = {
    run,
    help
};

async function run(fishsticks, cmd) {

    let workingMsg = null;

    await cmd.msg.reply({ content: 'Slating a URL scan. This will take a moment.' })
        .then(msg => {
            workingMsg = msg;
    });
    cmd.msg.delete({ timeout: 0 });

    const urlList = extURL(cmd.msg.content);

    log('info', '[URL-SCAN] Detected ' + urlList.length + ' URLs to scan.');

    for (const url in urlList) {
        validateURL(workingMsg, urlList[url]);
    }
}

function help() {
    return 'Scans a URL for malicious stuffs. May take a second.';
}