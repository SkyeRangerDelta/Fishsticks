//----EDIT----

const permsCheck = require('../../Modules/Functions/permissionsCheck.js');

let messagesJson;

const fs = require(`fs`);

exports.run = async (fishsticks, msg, cmd) => {
    msg.delete({timeout: 0});
    loadJSON();

    //Check perms
    let permissions = {
        "perms": ["Staff", "Bot"]
    }
    let done = await permsCheck.run(fishsticks, msg.member, permissions);
    if (!done) {
        throw "Permissions check failed!";
    }

    //Command Breakup
    let cmdAlt = msg.content.toLowerCase().split('-');
    let cmdRef = msg.content.split('-');
    let cmdFunc = cmdAlt[1].trim();

    console.log(cmdAlt);

    //!edit -func -[options]
    //!edit -motd -confirm -NewMOTD

    switch (cmdFunc) {
        case "motd":
                await motd(fishsticks, msg, cmd, cmdAlt);
            break;
        default:
            return msg.reply("Give it to me straight here, I don't know what " + cmdFunc() + " is.").then(sent => sent.delete({timeout: 10000}));
    }
}

//FUNCTIONS
async function motd(fishsticks, msg, cmd, cmdAlt) {
    console.log("[EDIT] Executing MOTD edit function...");
    let confirming = false;
    let newMOTD;

    try {
        if (cmdAlt[2].trim() == "confirm") {            
            newMOTD = cmd.slice(2).join(' ').trim();
            confirming = true;
            console.log("[EDIT] User is confirming new MOTD.");
        }
    } catch (error) {
        let motd = messagesJson.motd;
        console.log("[EDIT] Loaded MOTD.\n\nIf error:");
        console.log(error);
        return msg.channel.send("Loading current MOTD. Copy this, edit it, and then post it back here using `-confirm` after `-motd`. You may use keywords (check codex or command listing) to ping people or insert statements.\n\n```" + motd + "```\n\n*Deletes in 45 seconds.*").then(sent => sent.delete({timeout: 45000}));
    }

    if (confirming) {
        let confirmMOTD = newMOTD.replace("{ranger}", fishsticks.ranger);
        let finalMOTD = confirmMOTD.substring(1);

        messagesJson.motd = finalMOTD;

        msg.reply("Cool, does this look good? (Click a reaction).").then(sent => sent.delete({timeout: 15000}));
        return msg.channel.send(finalMOTD).then(async sent => {
            await sent.react('✅');
            await sent.react('❌');
            return fishsticks.motdMessages.push(sent.id);
        });

    } else {
        return msg.reply("I don't know how you got here, but I am not too afraid to ask. Yo " + fishsticks.ranger + ", check this out please.");
    }
}

function loadJSON() {
    console.log("[EDIT] Loading Messages File...");
    try {
        messagesJson = JSON.parse(fs.readFileSync("./Modules/VariableMessages/messages.json", "utf8"));
    } catch (loadMsgsErr) {
        return msg.reply("Error in neural sector 9. Failed to load a core file. Offloading dump report and notifying " + fishsticks.ranger);
    }
}