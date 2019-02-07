//WORD OF THE DAY

const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    const statement = msg.content.split('-');

    //Embed object data
    let embedData = {
        TITLE: 'I am a Title.',
        SCRIPTURE: 'This is a piece of scripture.',
        VERSE: 'This is the proper verse where the scripture came from.',
        LINK: 'I am a link.'
    }

    //Initialize object data
    try {

        embedData.TITLE = statement[1];
        if (embedData.TITLE == null || embedData.TITLE == undefined) throw "i couldn't find a title! [Param 1/4]";

        embedData.SCRIPTURE = statement[2];
        if (embedData.SCRIPTURE == null || embedData.SCRIPTURE == undefined) throw "i couldn't find a scripture piece! [Param 2/4]";

        embedData.VERSE = statement[3];
        if (embedData.VERSE == null || embedData.VERSE == undefined) throw "i couldn't find a verse! [Param 3/4]";

        embedData.LINK = statement[4];
        if (embedData.LINK == null || embedData.LINK == undefined) {
            throw "i couldn't find a link! [Param 4/4]";
        }
        else if (!(embedData.LINK.includes(".com"))) throw "that the link you gave wasn't a link! [Param 4/4]";

    } catch (initilizerErr) {
        msg.reply("Mmm, it would seem " + initilizerErr + ". Perhaps checking `!codex wotd` would help?");
        return console.log("[WOTD] " + initilizerErr);
    }

    //Create embed object
    let wotdEmbed = new Discord.RichEmbed();
        wotdEmbed.setColor(config.fscolor);
        wotdEmbed.setTitle("Word of the Day");
        wotdEmbed.addField(embedData.TITLE, embedData.SCRIPTURE , false);
        wotdEmbed.addField(embedData.VERSE, embedData.LINK, false);
        wotdEmbed.setDescription("*Daily from Clarence's Corner*");

    msg.channel.send({embed: wotdEmbed});

}