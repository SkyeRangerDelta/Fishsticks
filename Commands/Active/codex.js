const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');
const colors = require('colors');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    let entry = cmd[0];
    console.log(colors.blue("[CODEX] Attempting to find a codex entry " + entry));
    fishsticks.commandAttempts++;

    try {
        let codexCommand = require(`../../Commands/Active/Codex/${entry}.js`);
        codexCommand.run(fishsticks, msg, entry);
        console.log(colors.blue("[CODEX] Success"));
        fishsticks.commandSuccess++;
    } catch (codexErr) {
        console.log(colors.cyan("[CODEX] Failed:\n" + codexErr));
        return msg.reply("Hmm, that's not an entry in the codex. (Should it be? Ask Ranger.)").then(sent => sent.delete(20000));
    }
}