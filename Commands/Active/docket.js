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

    if (cmdRef[1] == undefined) {
        return await loadDocketItems(msg);
    }

    switch (cmdRef[1].trim()) {
        case "add":
            docketAdd(cmdRef2, msg);
            break;
        case "clear":
            docketClear(msg);
            break;
        default:
            console.log("Loading the docket...");

            return await loadDocketItems(msg);
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

function docketAdd(content, msg) {
    console.log("[DOCKET] Adding to the docket");

    let handleDate = `**${msg.author.username}**: ${msg.createdAt.getMonth()}/${msg.createdAt.getDate()}/${msg.createdAt.getFullYear()} @ ${msg.createdAt.getHours()}:${msg.createdAt.getMinutes()}`;
    let subject = content.slice(2).join(' ');

    let docketObj = {
        "inline": false,
        "name": handleDate,
        "value": subject
    }

    docketJson.docketItems.push(docketObj);

    saveJSON(docketJson);

    return msg.reply("Added to the docket!").then(sent => sent.delete(10000));
}

function loadDocketItems(msg) {
    let descMsg = "";

    if (docketJson.docketItems.length == 0 || docketJson.docketItems == null) {
        return msg.channel.send("**No items on the docket.**\n*Add one using `!docket -add`.*").then(sent => sent.delete(10000));
    }

    for (item in docketJson.docketItems) {
        descMsg = descMsg.concat("- " + docketJson.docketItems[item] + "\n");
    }

    let docketEmbed = new Discord.RichEmbed();
        docketEmbed.setTitle("o0o - Meeting Docket - o0o");
        docketEmbed.setColor(fsconfig.fscolor);
        docketEmbed.setFooter("List will delete in 1 minute. List summoned by " + msg.author.username + ".");
        docketEmbed.setDescription("Meeting items for discussion:");
        docketEmbed.fields = docketJson.docketItems;

    return msg.channel.send({embed: docketEmbed}).then(sent => sent.delete(60000));
}

function docketClear(msg) {

    //Check perms
    let permissions = {
        "perms": ["Staff", "Bot"]
    }
    let done = await permsCheck.run(fishsticks, msg.member, permissions);
    if (!done) {
        msg.reply("Only staff can clear the docket!").then(sent => sent.delete(10000));
    }

    console.log("[DOCKET] Clearing docket");

    let jsonContent = {
        "docketItems": []
    }

    saveJSON(jsonContent);

    return msg.reply("Docket cleared!").then(sent => sent.delete(10000));
}