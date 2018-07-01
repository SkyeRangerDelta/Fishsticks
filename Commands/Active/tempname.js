const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const chs = require('../../Modules/fs_channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var newName = cmd[1];
    var userChannel = msg.member.voiceChannel.id;
    var inTempCh = false;

    var ranger = fishsticks.users.get("107203929447616512");

    for (c = 0; c < fishsticks.tempChannels.length; c++) {
        if (userChannel == (fishsticks.tempChannels.get(fishsticks.tempChannels[c]))) {
            inTempCh = true;
            break;
        }
    }

    console.log("[TEMP-CHA] Rename Command Received. Attempt to change channel " + userChannel + " name to " + newName);

    function accept() {
        console.log("[TEMP-CHA] Accepted, changing name...");
        userChannel.setName(newName).then(newChannel => console.log("[TEMP-CHA] Channel name changed to " + newChannel + " successfully.").catch(console.error));
        msg.reply("Channel name changed to " + newName + " successfully!").then(sent => sent.delete(10000));
    }

    if (fishsticks.engmode == true) { //CHECK ENGINEERING MODE
        console.log("[TEMP-CHA] Channel name change attempted with ENGM enabled!");

        if (msg.member.roles.find('name', 'Staff')) { //CHECK STAFF OVERRIDE DURING ENGINEERING MODE
            console.log("[TEMP-CHA] Staff Override Received. Checking channel validity...");
    
            if (inTempCh == false) { //IF NOT IN TEMP CHANNEL, REJECT WITH NOTE
                console.log("[TEMP-CHA] Not a temp channel, request ignored.");
                msg.reply("Umm, this is not a temporary voice channel! Consult " + ranger + " before changing this channel's name!").then(sent => sent.delete(10000));
            }
            else if (inTempCh == true) { //IF IN TEMP CHANNEL, ACCEPT
                msg.reply("Staff override recognized, changing channel name...").then(sent => sent.delete(10000));
                accept();
            }
            else { //IF UNKNOWN WTH IS GOING ON, REJECT AND CALL AID
                console.log("[TEMP-CHA] Something's wrong...check for errors?");
                msg.reply("Huh. Seems that something's not right. Let me call for assistance: " + ranger).then(sent => sent.delete(60000));
            }
        }
        else {
            console.log("[TEMP-CHA] Non-staff attempt. Ignoring request.");
            msg.reply("Engineering Mode is enabled! Have someone disable it first!").then(sent => sent.delete(10000));
        }
    }
    else {
        if (msg.member.roles.find('name', 'Staff')) {
            console.log("[TEMP-CHA] Staff Override Received. Checking channel validity...")

            if (inTempCh == false) { //IF NOT IN TEMP CHANNEL, REJECT WITH NOTE
                console.log("[TEMP-CHA] Not a temp channel, request ignored.")
                msg.reply("Umm, this is not a temporary voice channel! Consult " + ranger + " before changing this channel's name!").then(sent => sent.delete(10000));
            }
            else if (inTempCh == true) { //IF IN TEMP CHANNEL, ACCEPT
                msg.reply("Staff override recognized, changing channel name...").then(sent => sent.delete(10000));
                accept();
            }
            else { //IF UNKNOWN WTH IS GOING ON, REJECT AND CALL AID
                console.log("[TEMP-CHA] Something's wrong...check for errors?");
                msg.reply("Huh. Seems that something's not right. Let me call for assistance: " + ranger).then(sent => sent.delete(60000));
            }
        }
        else if ((msg.member.roles.find('name', 'CC Member')) || (msg.member.roles.find('name', 'ACC Member'))) {
            console.log("[TEMP-CHA] Non-staff command recieved. Checking channel validity...")
            if (inTempCh == false) {
                console.log("[TEMP-CHA] Not a temp channel, request ignored.")
                msg.reply("You're not in a temporary voice channel! You can't change this channel's name!").then(sent => sent.delete(10000));
            }
            else if (inTempCh == true) {
                msg.reply("Acknowledged. Attempting channel name change...");
                accept();
            }
            else {
                console.log("[TEMP-CHA] Something's wrong...check for errors?");
                msg.reply("Huh. Seems that something's not right. Let me call for assistance: " + ranger).then(sent => sent.delete(60000));
            }
        }
    }

}