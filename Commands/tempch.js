const Discord = require('discord.js');
const sys = require('../Modules/Core/coresys.json');
const fs = require('fs');
const engm = require('../Modules/fishsticks_engm.json');
const chs = require('../Modules/fs_channels.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let engmode = engm.engmode;

    if (msg.member.roles.find('name', 'Staff') || msg.member.roles.find('name', 'Bot')) {
        if (engmode == true) {
            var maxUsers = parseInt(cmd[0]) || 0;
            var tname = args[1] ? args.slice(1).join(" ") : args.join(' ');

            var tempChannelCategory = fishsticks.channels.get(chs.tempchannelCat);
            var channelCloner = fishsticks.channels.get(chs.fs_vcclone);
            var tchID;

            var user = msg.member;
            const userVC = user.voiceChannelID;

            if (userVC == undefined || userVC != channelSpawner) {
                msg.reply("Join the #channel-spawner channel first!").then(sent => sent.delete(15000));
            }
            else if (userVC === channelSpawner) {
                fstempchclone.clone(tname)
                .then(clone => {
                console.log("[TEMP-CHA] Channel created called: " + tname + " by: " + msg.author.tag);

                tchID = clone.id;
                tempChannels.push(tchID);

                console.log("[TEMP-CHA] Channel " + tname + " has ID: " + tchID);
                console.log("[TEMP-CHA] Temp Channels now include " + tempChannels.length + " channels of IDs: ");

                msg.reply("Channel created!").then(sent => sent.delete(15000));

                for (x = 0; x < tempChannels.length; x++) {
                    console.log(tempChannels[x]);
                }

                clone.setParent(tempChannelCat);

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