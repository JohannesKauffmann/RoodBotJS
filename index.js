const Discord = require('discord.js');
const client = new Discord.Client();

// Kick a user when they send a message but they're offline
client.on('message', (message) => {
	if(!message.author.bot) {
		var status = message.author.presence.status;
		// Check wether the user is offline or not
		if(status === 'offline') {
			const user = message.author;
			const member = message.guild.member(user);
			// Check wether we can kick the user
			if(member.kickable) {
				// Save their  nickname and roles for when they rejoin
				// TODO: implement
				// Send a DM to the user so they can rejoin
				message.channel.createInvite()
					.then(invite => member.send(`
						You have been yeeted from ${message.guild.name} for using invisible mode. You get a chance to
						redeem yourself byusing this invite code: ${invite.code}`)
					);
				// Finally, kick the user
				member.kick("You can't converse in this server while being offline.")
					.then(console.log(`Kicked ${member.displayName}`))
					.catch(console.error);
				message.channel.send(`${member.displayName} ist von der Server geyeetet weil Sie invisible mode benutzen. Sie sind allen gewarnt.`);
			} else {
				message.reply("I can't kick you, but you should be for using invisible mode. Fuck you.");
			}
		}
	}
});

// Read bot token from file system
var fs = require('fs');
var path = require('path');

client.login(
	fs.readFileSync(path.join(__dirname, 'token.txt'), {encoding: 'utf8' })
);
