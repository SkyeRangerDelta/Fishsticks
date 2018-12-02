const Discord = require('discord.js');
const apiindex = require('../../Modules/fs_systems.json');
const config = require('../../Modules/Core/corecfg.json');
const embeds = require('../embeds/main.json');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const bibApi = apiindex.bibleAPI;
const striptags = require('striptags');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let incomplete = new Discord.RichEmbed();
        incomplete.setTitle("o0o - Command Incomplete - o0o");
        incomplete.setColor(config.fscolor);
        incomplete.setDescription(embeds.commands.incomplete);
        incomplete.addField("Reason:", "Command is not finished. API handling and Fishsticks' interaction don't get along well.", true);

    return msg.reply({embed: incomplete}).then(sent => sent.delete(15000));

    /*
    let book;
    let bookNum;
    let chapter;
    let verse;
    let endVerse;

    let bib_Book;

    

    if (isNaN(cmd[0])) { //If book is not a number (ie, !bible Genesis 1:3)
        book = cmd[0].toUpperCase();
        chapter = cmd[1];
        verse = cmd[2];
        endVerse = cmd[3];

        processScript(false);
    }
    else { //If book is a number (ie, !bible 2 Samuel 3:4)
        bookNum = cmd[0];
        book = cmd[1].toUpperCase();
        chapter = cmd[2];
        verse = cmd[3];
        endVerse = cmd[4];

        processScript(true);
    }

    function processScript(compBook) {

        let scripturePassage = "";

        if (compBook) {

            console.log("[BIBLE SYSTEM] Attempting to process compound book request with the following settings:\n"
            + "\tBook Number: " + bookNum + "\n"
            + "\tBook: " + book + "\n"
            + "\tChapter: " + chapter + "\n"
            + "\tVerse: " + verse + "\n"
            + "\tEnding at verse: " + endVerse);

            bib_Book = bookNum + book.substring(0,2);

            console.log("[BIBLE SYSTEM] Setting book to: " + bib_Book);

            processChapters(bib_Book).then(bookResult => {
                console.log("[BIBLE SYSTEM] Book has " + bookResult + " chapters.");

                if (chapter < 1 || chapter > bookResult) {
                    return msg.reply("That chapter doesn't exist!").then(sent => sent.delete(15000));
                }

                let chapterID = bib_Book + "." + chapter;
                console.log("[BIBLE SYSTEM] Setting chapter ID to: " + chapterID);

                processVerses(bib_Book, chapterID).then(verseResult => {
                    console.log("[BIBLE SYSTEM] Book has " + bookResult + " chapters.");

                    if (verse < 1 || verse > verseResult) {
                        return msg.reply("That verse doesn't exist in this chapter!").then(sent.delete(15000));
                    }

                    if (endVerse <= verse) {
                        return msg.reply("You can't read backwards!").then(sent.delete(15000));
                    }
                    else if (endVerse > verseResult) {
                        return msg.reply("There aren't that many verses in this chapter!").then(sent => sent.delete(15000));
                    }

                    let verseID = chapterID + "." + verse;
                    let endVerseID = chapterID + "." + endVerse;
                    console.log("[BIBLE SYSTEM] Setting verse ID to: " + verseID);

                    processScripture(verseID, endVerseID).then(scriptureResult => {

                    });
                });

            });
            
        }
        else {
            console.log("[BIBLE SYSTEM] Attempting to process request with the following settings:\n"
            + "\tBook: " + book + "\n"
            + "\tChapter " + chapter + "\n"
            + "\tVerse: " + verse + "\n"
            + "\tEnding at verse: " + endVerse);

            bib_Book = book.substring(0,3);

            if (book == "JOHN") {
                bib_Book = "JHN";
            }

            console.log("[BIBLE SYSTEM] Setting book to: " + bib_Book);

            processChapters(bib_Book).then(bookResult => {
                console.log("[BIBLE SYSTEM] Book has " + bookResult + " chapters.");

                if (chapter < 1 || chapter > bookResult) {
                    return msg.reply("That chapter doesn't exist in this book!").then(sent => sent.delete(15000));
                }

                let chapterID = bib_Book + "." + chapter;
                console.log("[BIBLE SYSTEM] Setting chapter ID to: " + chapterID);

                processVerses(chapterID).then(verseResult => {
                    console.log("[BIBLE SYSTEM] Book has " + bookResult + " chapters.");

                    if (verse < 1 || verse > verseResult) {
                        return msg.reply("That verse doesn't exist in this chapter!").then(sent.delete(15000));
                    }

                    if (endVerse <= verse) {
                        return msg.reply("You can't read backwards!").then(sent.delete(15000));
                    }
                    else if (endVerse > verseResult) {
                        return msg.reply("There aren't that many verses in this chapter!").then(sent => sent.delete(15000));
                    }

                    let verseID = chapterID + "." + verse;
                    console.log("[BIBLE SYSTEM] Setting starting verse ID to: " + verseID);

                    //SCRIPTUREPASSAGE

                    for (var i = verse; i < endVerse; i++) {
                        console.log("[BIBLE SYSTEM] Processing verse " + i);
                        processScripture(verseID).then(verseResult => {
                            scripturePassage.concat(verseResult);
                        });

                        verseID = chapterID + "." + i++;
                    }
                });
            });

            console.log("Compounded scripture: " + scripturePassage);
        }

        //Create scripture embed
        let scripture = new Discord.RichEmbed();
            if (compBook) {
                if (endVerse != null) {
                    scripture.setTitle(bookNum + " " + bib_Book + " " + chapter + ":" + verse + "-" + endVerse);
                }
                else {
                    scripture.setTitle(bookNum + " " + bib_Book + " " + chapter + ":" + verse);
                }
            }
            else {
                if (endVerse != null) {
                    scripture.setTitle(bib_Book + " " + chapter + ":" + verse + "-" + endVerse);
                }
                else {
                    scripture.setTitle(bib_Book + " " + chapter + ":" + verse);
                }
            }

        scripture.setColor(config.fscolor);
        scripture.setDescription(scripturePassage);
        
        msg.channel.send({embed: scripture});
    }

    function processChapters(bookToProcess) {

        let requester = new Promise((resolve, reject) => {

            let bibSys = new XMLHttpRequest();
            bibSys.withCredentials = false;

            bibSys.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const info = JSON.parse(this.responseText);
    
                    console.log("Chapters Received: " + info.data.length);
                    resolve(info.data.length);
                }
            });
        
            bibSys.open("GET", `https://api.scripture.api.bible/v1/bibles/${apiindex.bib_version}/books/${bookToProcess}/chapters`);
            bibSys.setRequestHeader(`api-key`, bibApi);
        
            bibSys.send(); 
        });

        return requester;
    }

    function processVerses(chapterToProcess) {

        console.log("[BIBLE SYSTEM] Requesting:\n" + `bible/v1/bibles/${apiindex.bib_version}/chapters/${chapterToProcess}/verses`);

        let requester = new Promise((resolve, reject) => {

            let bibSys = new XMLHttpRequest();
            bibSys.withCredentials = false;

            bibSys.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    const info = JSON.parse(this.responseText);
    
                    console.log("Verses Received: " + info.data.length);
                    resolve(info.data.length);
                }
            });
        
            bibSys.open("GET", `https://api.scripture.api.bible/v1/bibles/${apiindex.bib_version}/chapters/${chapterToProcess}/verses`);
            bibSys.setRequestHeader(`api-key`, bibApi);
        
            bibSys.send(); 
        });

        return requester;
    }

    function processScripture(verseToProcess) {
        
        console.log("[BIBLE SYSTEM] Requesting:\n" + `bible/v1/bibles/${apiindex.bib_version}/verses/${verseToProcess}`);

        let requester = new Promise((resolve, reject) => {

            let bibSys = new XMLHttpRequest();
            bibSys.withCredentials = false;

            bibSys.addEventListener("readystatechange", function () {
                if (this.readyState === this.DONE) {
                    console.log("Response: " + this.responseText)
    
                    const info = JSON.parse(this.responseText);
    
                    let verseRaw = info.data.content;
                    let verseFinal = striptags(verseRaw);
                    verseFinal = verseFinal + " ";
                    console.log("Verse Received: " + verseFinal);
                    resolve(verseFinal);
                }
            });
        
            bibSys.open("GET", `https://api.scripture.api.bible/v1/bibles/${apiindex.bib_version}/verses/${verseToProcess}`);
            bibSys.setRequestHeader(`api-key`, bibApi);
        
            bibSys.send(); 
        });

        return requester;
    }
    */
}