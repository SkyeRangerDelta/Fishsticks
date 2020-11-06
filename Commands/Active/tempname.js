const Discord = require('discord.js');
const config = require('../../Modules/Core/Core_config.json');
const chs = require('../../Modules/fs_ids.json');

const syslogFunc = require('../../Modules/Functions/syslog.js');

function syslog(message, level) {
    syslogFunc.run(fishsticks, message, level);
}

module.exports = {
    run,
    help
};

function run(fishsticks, cmd) {
    msg.delete({timeout: 0});

    return msg.reply('Command deactivated until V18 fixes. Ask staff for support.').then(sent => sent.delete({timeout: 10000}));
}

function help() {
    return 'Changes the name of a temporary channel.'
}