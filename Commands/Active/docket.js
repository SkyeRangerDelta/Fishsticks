//====DOCKET====

const Discord = require('discord.js');
const fs = require('fs');

const fsconfig = require('../../Modules/Core/corecfg.json');

let docketJson;

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete();
    docketJson = await loadJSON();

    //Syntax: !docket -[func] -[parameters]

    let cmdRef = msg.content.toLowerCase().split("-");
    let cmdRef2 = msg.content.split('-');

    console.log(cmdRef);

    switch (cmdRef[1].trim()) {
        case "add":
            docketAdd(cmdRef2);
            break;
        default:
            console.log("Loading the docket...");

        let docketList = await loadDocketItems();

            let docketEmbed = new Discord.RichEmbed();
                docketEmbed.setTitle("o0o - Meeting Docket - o0o");
                docketEmbed.setColor(fsconfig.fscolor);
                docketEmbed.setFooter("List will delete in 1 minute. List summoned by " + msg.author.username + ".");
                docketEmbed.setDescription(docketList);

            return msg.channel.send({embed: docketEmbed}).then(sent => sent.delete(60000));
    }
}

function loadJSON() {
    console.log("[DOCKET] Loading JSON");

    let jsonContent = JSON.parse(fs.readFileSync('./Modules/VariableMessages/docket.json', 'utf8'));
    return jsonContent;
}

function saveJSON(jsonObj) {
    console.log("[DOCKET] Saving JSON");

    fs.writeFileSync("./Modules/VariableMessages/docket.json", JSON.stringify(jsonObj));
}

function docketAdd(content) {
    console.add("[DOCKET] Adding to the docket");

    let subject = content.slice(1).join(' ');
    docketJson.docketItems.push(subject);

    saveJSON(docketJson);

    return msg.reply("Added to the docket!").then(sent => sent.delete(10000));
}

function loadDocketItems() {
    let descMsg = "";

    if (docketJson.docketItems.length == 0 || docketJson.docketItems == null) {
        return "No items on the docket.";
    }

    for (item in docketJson.docketItems) {
        descMsg = descMsg.concat("- " + docketJson.docketItems[item] + "\n");
    }

    return descMsg;
}

function docketClear() {
    console.log("[DOCKET] Clearing docket");

    let jsonContent = {
        "docketItems": []
    }

    saveJSON(jsonContent);

    return msg.reply("Docket cleared!").then(sent => sent.delete(10000));
}