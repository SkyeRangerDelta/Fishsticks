const Discord = require('discord.js');
const sys = require('../../Modules/Core/coresys.json');
const fs = require('fs');
const engm = require('../../Modules/fishsticks_engm.json');
const chs = require('../../Modules/fs_channels.json');

var tempChannels = [];

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let engmode = fishsticks.engmode;

    if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'CC Member') || msg.member.roles.find('name', 'Trusted') || msg.memeber.roles.find('name', 'ACC Member')) {
        if (engmode == true) {
            if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Bot')) {
                console.log("[TEMP-CHA] ENGM Override Executed: Permission granted to " + msg.author.tag + ".");

                msg.channel.send("ENGM Override Recognized. Granting permissions to " + msg.author.tag + ".");

                var maxUsers = parseInt(cmd[0]) || 0;
                var tname = cmd[1] ? cmd.slice(1).join(" ") : cmd.join(' ');
    
                var tempChannelCategory = chs.tempchannelCat;
                var channelCloner = chs.fs_vcclone;
                var channelClonerClone = fishsticks.channels.get(chs.fs_vcclone);
                var tchID;
    
                var user = msg.member;
                const userVC = user.voiceChannelID;
    
                if (userVC == undefined || userVC != channelCloner) {
                    msg.reply("Join the #channel-spawner channel first!").then(sent => sent.delete(15000));
                }
                else if (userVC === channelCloner) {
                    channelClonerClone.clone(tname)
                    .then(clone => {
                    console.log("[TEMP-CHA] Channel created called: " + tname + " by: " + msg.author.tag);
    
                    tchID = clone.id;
                    fishsticks.tempChannels.push(tchID);
    
                    console.log("[TEMP-CHA] Channel " + tname + " has ID: " + tchID);
                    console.log("[TEMP-CHA] Temp Channels now include " + fishsticks.tempChannels.length + " channels of IDs: ");
    
                    msg.reply("Channel created!").then(sent => sent.delete(15000));
    
                    for (x = 0; x < fishsticks.tempChannels.length; x++) {
                        console.log(fishsticks.tempChannels[x]);
                    }
    
                    clone.setParent(tempChannelCategory);
    
                    if (maxUsers > 1) {
                        clone.setUserLimit(maxUsers).then(clone => console.log("[TEMP-CHA] Channel '" + tname + "' set max users to " + maxUsers))
                        msg.reply("Setting user maximum to: " + maxUsers).then(sent => sent.delete(15000));
                    }
                    else if (maxUsers = null) {
    
                    }
    
                    msg.member.setVoiceChannel(tchID);
                
                    })
                    .catch(console.error);
                }
            }
            else {
                msg.reply("Engineering mode is enabled! Disable it for using this command! (Ask a staff member).");
            }
            
        } else {
            var maxUsers = parseInt(cmd[0]) || 0;
            var tname = cmd[1] ? cmd.slice(1).join(" ") : cmd.join(' ');

            var tempChannelCategory = chs.tempchannelCat;
            var channelCloner = chs.fs_vcclone;
            var channelClonerClone = fishsticks.channels.get(chs.fs_vcclone);
            var tchID;

            var user = msg.member;
            const userVC = user.voiceChannelID;

            if (userVC == undefined || userVC != channelCloner) {
                msg.reply("Join the #channel-spawner channel first!").then(sent => sent.delete(15000));
            }
            else if (userVC === channelCloner) {
                channelClonerClone.clone(tname)
                .then(clone => {
                console.log("[TEMP-CHA] Channel created called: " + tname + " by: " + msg.author.tag);

                tchID = clone.id;
                fishsticks.tempChannels.push(tchID);

                console.log("[TEMP-CHA] Channel " + tname + " has ID: " + tchID);
                console.log("[TEMP-CHA] Temp Channels now include " + fishsticks.tempChannels.length + " channels of IDs: ");

                msg.reply("Channel created!").then(sent => sent.delete(15000));

                for (x = 0; x < fishsticks.tempChannels.length; x++) {
                    console.log(fishsticks.tempChannels[x]);
                }

                clone.setParent(tempChannelCategory);

                if (maxUsers > 1) {
                    clone.setUserLimit(maxUsers).then(clone => console.log("[TEMP-CHA] Channel '" + tname + "' set max users to " + maxUsers))
                    msg.reply("Setting user maximum to: " + maxUsers).then(sent => sent.delete(15000));
                }
                else if (maxUsers = null) {

                }

                msg.member.setVoiceChannel(tchID);
            
                })
                .catch(console.error);
            }
            
        }
    }
}