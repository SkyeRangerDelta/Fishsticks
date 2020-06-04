const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_ids.json');

const syslogFunc = require('../../Modules/Functions/syslog.js');

function syslog(message, level) {
    syslogFunc.run(fishsticks, message, level);
}

exports.run = (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});

    return msg.reply('Command deactivated until V18 fixes. Ask staff for support.').then(sent => sent.delete({timeout: 10000}));

    var newName = cmd.join(' ');
    var userChannel = msg.member.voiceChannel;
    let inTempCh;

    var ranger = fishsticks.users.cache.get("107203929447616512");

    for (c = 0; c < fishsticks.tempChannels.length; c++) {
        if (userChannel == (fishsticks.channels.cache.get(fishsticks.tempChannels[c]))) {
            check();
            inTempCh = true;
        }
    }

    if (inTempCh !== true) {
        if (msg.member.roles.find('name', 'Staff')) {
            msg.reply("You're trying to change a channel name for a channel that is not temporary! Check with " + ranger + " before doing that!");
        }
        else {
            msg.reply("You're not in a temporary voice channel! You can't change this channel's name!").then(sent => sent.delete({timeout: 10000}));
        }
    }

    console.log("[TEMP-CHA] Rename Command Received. Attempt to change channel " + userChannel + " name to " + newName);

    function accept() {
        syslog("[TEMP-CHA] Accepted, changing name...", 2);

        userChannel.setName(newName).then(newChannel => syslog("[TEMP-CHA] Channel name changed to " + newChannel + " successfully.", 2));

        msg.reply("Channel name changed to " + newName + " successfully!").then(sent => sent.delete({timeout: 10000}));
    }

    function check() {
        if (fishsticks.engmode == true) { //CHECK ENGINEERING MODE
            syslog("[TEMP-CHA] Channel name change attempted with ENGM enabled!", 3);
    
            if (msg.member.roles.find('name', 'Staff')) { //CHECK STAFF OVERRIDE DURING ENGINEERING MODE
                syslog("[TEMP-CHA] Staff Override Received. Checking channel validity...", 2);
        
                msg.reply("Staff override recognized, changing channel name...").then(sent => sent.delete({timeout: 10000}));
                accept();
            }
            else { //REJECT IF NOT STAFF
                syslog("[TEMP-CHA] Non-staff attempt. Ignoring request.", 1);
                msg.reply("Engineering Mode is enabled! Have someone disable it first!").then(sent => sent.delete({timeout: 10000}));
            }
        }
        else { //IF ENGM NOT ENABLED
            if (msg.member.roles.find('name', 'Staff')) { //CHECK STAFF
                syslog("[TEMP-CHA] Staff Override Received. Checking channel validity...", 2)
    
                msg.reply("Staff override recognized, changing channel name...").then(sent => sent.delete({timeout: 10000}));
                accept(); //ACCEPT
            }
            else if ((msg.member.roles.find('name', 'CC Member')) || (msg.member.roles.find('name', 'ACC Member'))) {
                syslog("[TEMP-CHA] Non-staff command recieved. Checking channel validity...", 2)
                
                msg.reply("Acknowledged. Attempting channel name change...");
                accept();
            }
            else {
                msg.reply("You must be a (A)CC Member in order to rename temporary channels!").then(sent => sent.delete({timeout: 10000}));
            }
        }
    }

}