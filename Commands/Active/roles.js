const Discord = require('discord.js');
const config = require('../../Modules/Core/corecfg.json');

exports.run = (fishsticks, msg, cmd) => {
    msg.delete();

    var roles = new Discord.RichEmbed();
			roles.setTitle("o0o - CC DISCORD ROLES - o0o")
			roles.setColor(config.fscolor);
			roles.setDescription(
				"Roles are the 'groups' that you as a user can be assigned to. They control the permissions that you have the power to work with. Here's a nifty list to describe them.\n" +
				"**Everyone**: Welcome friend! Get to know the community and you'll be granted Recognized. Lowest level, limited permissions.\n"+
				"**Logger**: The logger bot's role.\n" +
				"**Recognized**: Non-member regular of the community. Has most functions.\n" +
				"**Applicant**: Has applied for membership.\n" +
				"**CC Member / ACC Member**: Facade role, mainly used by Fishsticks - designates official members.\n" +
				"**Moderator**: Moderator role, has basic moderation permissions.\n"+
				"**Bot**: Default bot role (plus SkyeRanger). Can ban you.\n" +
				"**Staff**: All perms except server management.\n" +
				"**Event Coordinator**: Staff subset, coordinators setup events!\n" +
				"**Division Leader**: Staff subset, manages a division!\n" +
				"**Tech Support**: Staff subset with Administrator permissions; they fix/manmage stuff!\n" +
				"**Council Advisor**: Staff/CM subset, they are advisors to the council!\n" +
				"**Council Member**: Server administrator (all perms) - They're council members!\n\n" +
				"**Ark: SE**: Ark: Survival Evolved player.\n"+
				"**Creative**: Typically seen around the Art Gallery, involved with graphics/media creation."+
				"**Overwatch**: Overwatch player.\n"+
				"**PUBG**: PLAYERUNKNOWN'S BATTLEGROUNDS player.\n\n"+
				"``This message will delete itself in 1 minute.``"
			)

    msg.channel.send({embed: roles}).then(sent => sent.delete(30000));
}