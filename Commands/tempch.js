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
            
        }
    }
}