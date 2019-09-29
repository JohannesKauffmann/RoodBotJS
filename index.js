const Discord = require('discord.js');
const client = new Discord.Client();

// Kick a user whent they message but they're offline
client.on('message', (message) => {
	if(!message.author.bot) {
		var status = message.author.presence.status;
		// Check wether the user is offline or not
		if(status === 'offline') {
			const user = message.author;
			const member = message.guild.member(user);
			// Check wether we can kick the user
			if(member.kickable) {
				member.kick("You can't converse in this server while being offline.")
					.then(console.log(`Kicked ${member.displayName}`))
					.catch(console.error);
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
