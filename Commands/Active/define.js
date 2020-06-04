//----DEFINE----

const config = require('../../Modules/Core/corecfg.json');
const systems = require('../../Modules/fs_systems.json');
const dictKey = systems.dictKey;
const dictID = systems.dictID;

const Dictionary = require('oxford-dictionary-api');
const Discord = require('discord.js');

exports.run = async (fishticks, msg, cmd) => {
    msg.delete({timeout: 0});

    //Command Breakup
    let word = cmd[0];

    //Handle Dispatch
    let dict = new Dictionary(dictID, dictKey);
    dict.find(word, function(error, data) {
        if (error) {
            console.log(error);
            return msg.reply("Looks like we've got an error here. TO THE LOG!").then(sent => sent.delete({timeout: 10000}));
        }

        console.log(data);
    });
}