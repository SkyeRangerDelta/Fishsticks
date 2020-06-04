//----ACCOUNT----
//Handles user account creation and deletion
const Discord = require('discord.js');

const permsCheck = require('../../Modules/Functions/permissionsCheck.js');
const subCheck = require('../../Modules/Functions/subroutineCheck.js');
const query = require('../../Modules/Functions/db/query.js');
const config = require('../../Modules/Core/corecfg.json');

const log = require('../../Modules/Functions/syslog.js');

let permissions = {
    "perms": ["CC Member", "ACC Member"]
}

exports.run = async (fishsticks, msg, cmd) => {

    msg.delete({timeout: 0});

    return msg.reply('Command deactivated until V18 fixes. Ask staff for support.').then(sent => sent.delete({timeout: 10000}));

    if (await permsCheck.run(fishsticks, msg.member, permissions)) { //Check Permissions
        if (await subCheck.run(fishsticks, 'sqlsys', msg) && await subCheck.run(fishsticks, 'acctsys', msg)) { //Check SQL Subroutine State

            let msgBreakup = msg.content.split("-");

            let cmdFunction = msgBreakup[1].toLowerCase().trim();

            log.run(fishsticks, "[ACCT-SYS] Account command detected.", 2);

            if (cmdFunction == "create") {
                let user = msgBreakup[2].trim();
                let passA = msgBreakup[3].trim();
                let passB = msgBreakup[4].trim();

                if (!passB) {
                    return msg.reply("Hey now, syntax is -create -[username] -[password] -[confirm password]");
                }

                if (passA !== passB) {
                    return msg.reply("Your passwords need to match!").then(sent => sent.delete({timeout: 15000}));
                }

                //Check to make sure this user doesn't already have an account
                let duplicateCheckString = `SELECT discordID FROM siteAccounts WHERE discordID = ${msg.author.id}`;
                let duplicateResponse = await query.run(fishsticks, duplicateCheckString);

                if (duplicateResponse[0] == msg.author.id) {
                    return msg.reply("Looks like you've already got an account! If you've forgotten your information, let " + fishsticks.ranger + " know so he can help you!").then(sent => sent.delete({timeout: 15000}));
                }

                //Passwords match, create SQL query
                let queryString = `INSERT INTO siteAccounts (username, password, discordID) VALUES ('${user}', '${passA}', ${msg.author.id})`;
                let response = await query.run(fishsticks, queryString);

                //Check response
                if (response.affectedRows == 1) {
                    msg.reply("Account created, check your DMs!").then(sent => sent.delete({timeout: 15000}));

                    //Create account info panel and send
                    let accountCreated = new Discord.MessageEmbed();
                        accountCreated.setTitle("Fishsticks Account Opening");
                        accountCreated.setColor(config.fsemercolor);
                        accountCreated.setDescription(
                            "You have opened a new Fishsticks account. This account permits you, as an (A)CC Member to customize various aspects of Fishsticks. This is done via the web" +
                            "front available at the link below. Within the online dashboard, you wil be able to build custom playlists for the music player, view various Fishsticks systems" +
                            ", change your password, etc. and more as development continues."
                        );
                        accountCreated.addField("Account Details", "Username: `" + user + "`\nPassword: `" + passA + "`");
                        accountCreated.addField("Account Management", "Within the Fishsticks dashboard, you will be able to edit your password and your username. Your account however is" +
                            " tied to your Discord ID. You use Fishsticks to create and delete the account so that your Discord ID can be authenticated with minimal amounts of risk of someone" + 
                            " else making an account with your ID. If you wish to delete your Fishsticks account, simply run `!account delete [account password]` to delete it. Should you forget your" +
                            " password, let SkyeRangerDelta know and he'll let you know what it is."
                        );
                        accountCreated.addField("Dashboard", "To view your dashboard,\n[Click Here](https://fishsticks.pldyn.net/)\n\nOr visit https://fishsticks.pldyn.net/");
                        accountCreated.setFooter("Account Opening Info - " + msg.author.username + " <-> This message will delete itself in 5m.");

                    msg.author.send({embed: accountCreated}).then(sent => sent.delete({timeout: 30000}));
                }

            } else if (cmdFunction == "delete") {
                let querySelectString = `SELECT password FROM siteAccounts WHERE discordID = ${msg.author.id}`;
                let response = await query.run(fishsticks, querySelectString);

                if (response[0].password == cmd[1]) {
                    let responseB = await query.run(fishsticks, `DELETE FROM siteAccounts WHERE discordID = ${msg.author.id}`);
                    if (responseB.affectedRows == 1) {
                        return msg.reply("Account purged!").then(sent => sent.delete({timeout: 15000}));
                    }
                } else {
                    return msg.reply("Doesn't look like that password matches up with the account info.").then(sent => sent.delete({timeout: 15000}));
                }

            } else {
                msg.reply("*Cough*, did you mean `create` or `delete`?").then(sent => sent.delete({timeout: 15000}));
            }
        }
    }
}