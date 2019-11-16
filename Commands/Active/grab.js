//----GRAB----
//Meant to pull quotes from chat and save them

const quotesJSONfile = require('../../Modules/Quotes/Quotes.json');
const fs = require('fs');

exports.run = (fishsticks, msg, cmd) => {

    msg.delete();

    console.log("[GRAB] Quotes file found: " + fs.existsSync(`../../Modules/Quotes/Quotes.json`))

    let messageAuthor = msg.mentions.members.first();
    let lastMessageofAuthor = messageAuthor.lastMessage;

    if (fs.access(`../../Modules/Quotes/Quotes.json`, fs.constants.F_OK, (err) => {
        console.log("[GRAB] DUDE THERE'S AN ERROR.");
    })) { //Make sure the thing exists
        let quotesJSON = JSON.parse(fs.readFileSync('../../Modules/Quotes/Quotes.json', 'utf8'));
        let newQuote = {"author": messageAuthor.nickname, "phrase": lastMessageofAuthor.content};

        quotesJSON.quotes.push(newQuote);

        fs.writeFileSync('../../Modules/Quotes/Quotes.json', JSON.stringify(quotesJSON));

        return msg.reply("Grabbed!").then(sent => sent.delete(10000));
    } else { //If it doesn't...
        return msg.reply("I couldn't write to the quotes file! DID YOU DELETE IT!?").then(sent => sent.delete(10000)); //Freak out
    }
}