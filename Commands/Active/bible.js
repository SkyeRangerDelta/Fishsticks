const Discord = require('discord.js');
const apiindex = require('../../Modules/fs_systems.json');
const config = require('../../Modules/Core/corecfg.json');
const embeds = require('../embeds/main.json');
const bibApi = apiindex.bibleAPI;
const https = require('https');

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
        endverse: null,
        contCount: 1,
        bookFirst: false
    }

    // ["!bible", "2", "Samuel", "1:1"]
    // q="John+3:16"

    let cmdArgs = msg.content.toLowerCase().split(" ");
    params.bookNum = parseInt(cmdArgs[1]); //Set default book number
    
    if (params.bookNum== null || isNaN(params.bookNum)) { //If no book number
        params.book = cmdArgs[1];
        params.bookFirst = true;
    } else { //Get book
        if (typeof cmdArgs[2] == typeof "blah") {
            params.book = cmdArgs[2]
        } else {
            return msg.reply("Books titles are names not numbers.").then(sent => sent.delete(10000));
        }
    }

    //Handle chapter and verse build
    if (params.bookFirst) { //If not 1 Samuel
        let chapterBreak = cmdArgs[2].split(':');
        let verseBreak;
        params.chapter = chapterBreak[0];
        
        if (params.chapter.includes('-')) { //Check for verse range
            verseBreak = chapterBreak[1].split('-');
            params.verse = verseBreak[0];
            params.endverse = verseBreak[1];
        } else {
            params.verse = chapterBreak[1];
        }
    } else {
        let chapterBreak2 = cmdArgs[3].split(':');
        params.chapter = chapterBreak2[0];

        if (params.chapter.includes('-')) {
            verseBreak = chapterBreak2[1].split('-')[0];
            params.verse = verseBreak[0];
            params.endverse = verseBreak[1];
        } else {
            params.verse = chapterBreak2[1];
        }
    }

    buildPayload(params, msg);
}

//Construct a payload to be shipped off
async function buildPayload(paramObj, msg) {

    console.log("Attempting to build a payload request with the following information:\nParams:");
    console.log(paramObj);

    let API_URL = 'https://api.esv.org/v3/passage/text/';
    let dispatchURL;

    let args;

    if (paramObj.bookFirst) {
        if (paramObj.endverse == null) {
            args = {
                'q': `${paramObj.book}+${paramObj.chapter}:${paramObj.verse}`
            }
        } else {
            args = {
                'q': `${paramObj.book}+${paramObj.chapter}:${paramObj.verse}-${paramObj.endverse}`
            }
        }
    } else {
        if (paramObj.endverse == null) {
            args = {
                'q': `${paramObj.bookNum}+${paramObj.book}+${paramObj.chapter}:${paramObj.verse}`
            }
        } else {
            args = {
                'q': `${paramObj.bookNum}+${paramObj.book}+${paramObj.chapter}:${paramObj.verse}-${paramObj.endverse}`
            }
        }
    }

    dispatchURL = API_URL + `?q=${args.q}`;

    let options = {
        headers: {
           'Authorization': `Token ${bibApi}`,
           'Connection': 'keep-alive',
           'Content-Type': 'application/json'
        }
    }

    console.log("Dispatching payload:\n" + dispatchURL);
    
    await https.get(dispatchURL, options, (res) => {
        res.on("data", content => {
            
            let received = JSON.parse(content);
            console.log(received.passages);

            if (received.passages.length > 2048) {
                return msg.reply("The passage is too large! Try breaking it into smaller verses.").then(sent => sent.delete(10000));
            }

            let verseEmbed = new Discord.RichEmbed();
                verseEmbed.setTitle(`o0o - Bible (ESV) - o0o`);
                verseEmbed.setColor(config.fscolor);
                verseEmbed.setDescription(received.passages);

            msg.channel.send({embed: verseEmbed});
        })
    });
}