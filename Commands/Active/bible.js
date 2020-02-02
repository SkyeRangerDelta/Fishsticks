const Discord = require('discord.js');
const apiindex = require('../../Modules/fs_systems.json');
const config = require('../../Modules/Core/corecfg.json');
const embeds = require('../embeds/main.json');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const bibApi = apiindex.bibleAPI;
const striptags = require('striptags');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    //Command breakup
    /*
        !bible John 3:16
        !bible John 3:16-19
        !bible 2 Samuel 1:1
        !bible Genesis 1
    */

    let params = {
        bookNum: null,
        book: "John",
        chapter: 3,
        verse: 16,
        endverse: 16,
        contCount: 1
    }

    // ["!bible", "2", "Samuel", "1:1"]
    // q="John+3:16"

    let cmdArgs = msg.content.toLowerCase().split(" ");
    params.bookNum = parseInt(cmdArgs[1]);
    
    if (params.bookNum == null) {
        params.book = cmdArgs[1];
    }
}

//Construct a payload to be shipped off
function buildPayload() {

}