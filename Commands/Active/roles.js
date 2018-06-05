const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var roles = new Discord.RichEmbed();
			roles.setTitle("o0o - CC DISCORD ROLES - o0o")
			roles.setColor(config.fscolor);
			roles.setDescription(
				"Roles are the 'groups' that you as a user can be assigned to. They control the permissions that you have the power to work with. Here's a nifty list to describe them.\n" +
				"**Everyone**: No color assignment, default white. You can talk in the voice channels and read text history.\n"+
				"**Logger**: The logger bot's role.\n" +
				"**Trusted**: Everyone role plus text chat functions. Can change nickname.\n" +
				"**Applicant**: Trusted, but cannot attach files.\n" +
				"**Members**: Trusted but can also move users.\n" +
				"**ACC Member**: Identifier for ACC - no perms, works in tangent with Members role.\n" +
				"**CC Members**: Identifier for CC - no permissions, works in tangent with Members role.\n" +
				"**Timeout**: No permissions except for reading text channels.\n" +
				"**Admin**: There's a lot of permissions in there. Cannot create invites or manage emojis.\n"+
				"**Bot**: Default bot role (plus SkyeRanger). Can ban you.\n" +
				"**Staff**: All perms except server management.\n" +
				"**Event Coordinator**: Identifier for ECs. Used in tangent with another permissions role such as Staff.\n" +
				"**Division Leader**: Identifier for DLs. Used in tangent with another permissions role.\n" +
				"**Tech Support**: Administrator level permissions. Add-on permissions used in tangent with another role.\n" +
				"**Council Advisor**: Server administration permissions. Add-on permissions used in tangent with another role.\n" +
				"**Council Member**: Administrator level permissions. Add-on permissions used in tangent with another role.\n\n" +
				"**Ark: SE**: Ark: Survival Evolved player.\n"+
				"**Overwatch**: Overwatch player.\n"+
				"**PUBG**: PLAYERUNKNOWN'S BATTLEGROUNDS player.\n"+
				"**Rocket League**: Rocket League player.\n\n"+
				"``This message will delete itself in 1 minute.``"
			)

    msg.channel.send({embed: roles}).then(sent => sent.delete(30000));
}