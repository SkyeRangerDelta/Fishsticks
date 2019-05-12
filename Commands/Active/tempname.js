const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_ids.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var newName = cmd.join(' ');
    var userChannel = msg.member.voiceChannel;
    let inTempCh;

    var ranger = fishsticks.users.get("107203929447616512");

    for (c = 0; c < fishsticks.tempChannels.length; c++) {
        if (userChannel == (fishsticks.channels.get(fishsticks.tempChannels[c]))) {
            check();
            inTempCh = true;
        }
    }

    if (inTempCh !== true) {
        if (msg.member.roles.find('name', 'Staff')) {
            msg.reply("You're trying to change a channel name for a channel that is not temporary! Check with " + ranger + " before doing that!");
        }
        else {
            msg.reply("You're not in a temporary voice channel! You can't change this channel's name!").then(sent => sent.delete(10000));
        }
    }

    console.log("[TEMP-CHA] Rename Command Received. Attempt to change channel " + userChannel + " name to " + newName);

    function accept() {
        console.log("[TEMP-CHA] Accepted, changing name...");

        userChannel.setName(newName).then(newChannel => console.log("[TEMP-CHA] Channel name changed to " + newChannel + " successfully."));

        msg.reply("Channel name changed to " + newName + " successfully!").then(sent => sent.delete(10000));
    }

    function check() {
        if (fishsticks.engmode == true) { //CHECK ENGINEERING MODE
            console.log("[TEMP-CHA] Channel name change attempted with ENGM enabled!");
    
            if (msg.member.roles.find('name', 'Staff')) { //CHECK STAFF OVERRIDE DURING ENGINEERING MODE
                console.log("[TEMP-CHA] Staff Override Received. Checking channel validity...");
        
                msg.reply("Staff override recognized, changing channel name...").then(sent => sent.delete(10000));
                accept();
            }
            else { //REJECT IF NOT STAFF
                console.log("[TEMP-CHA] Non-staff attempt. Ignoring request.");
                msg.reply("Engineering Mode is enabled! Have someone disable it first!").then(sent => sent.delete(10000));
            }
        }
        else { //IF ENGM NOT ENABLED
            if (msg.member.roles.find('name', 'Staff')) { //CHECK STAFF
                console.log("[TEMP-CHA] Staff Override Received. Checking channel validity...")
    
                msg.reply("Staff override recognized, changing channel name...").then(sent => sent.delete(10000));
                accept(); //ACCEPT
            }
            else if ((msg.member.roles.find('name', 'CC Member')) || (msg.member.roles.find('name', 'ACC Member'))) {
                console.log("[TEMP-CHA] Non-staff command recieved. Checking channel validity...")
                
                msg.reply("Acknowledged. Attempting channel name change...");
                accept();
            }
            else {
                msg.reply("You must be a (A)CC Member in order to rename temporary channels!").then(sent => sent.delete(10000));
            }
        }
    }

}