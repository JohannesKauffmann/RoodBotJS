const Discord = require('discord.js');
const client = new Discord.Client();

// Save a list of kicked members // with their nickname and roles
// Upon rejoining they get removed from this list
var kickedMembers = [];

// Emit a message when the bot starts running
client.on('ready', () => {
	console.log('RoodBot has succesfully started!');
});

// Kick a user when they send a message but they're offline
client.on('message', (message) => {
	// Ignore messages from the bot, that aren't from a guild and join messages
	if(!message.author.bot && message.guild && message.type !== 'GUILD_MEMBER_JOIN') {
		var status = message.author.presence.status;
		// Check wether the user is offline or not
		if(status === 'offline') {
			const user = message.author;
			const member = message.guild.member(user);
			// Check wether we can kick the user
			if(member.kickable) {
				// Add their object to a list for when they rejoin so they can regain their nickname and roles
				kickedMembers.push(member);
				// First, set the invite link parameters
				var options = {
					temporary:false,
					maxAge:86400,
					maxUses:1,
					unique:true
				};
				var reason = `Let ${member.displayName} rejoin so they can redeem themselves`;
				// Create a DM channel
				member.createDM()
					.then((DMChannel) => {
						message.channel.createInvite(options, reason)
							// Send a DM to the user so they can rejoin
							.then(invite => DMChannel.send(`
								You have been yeeted from ${message.guild.name} for using invisible mode. You get a chance to redeem `
								+ `yourself by using this invite: https://discord.gg/${invite.code}`)
							)
							.catch(console.error)
							.then(() => {
								// Finally, kick the member
								member.kick(`${member.tag} used invisible mode`)
									.then(console.log(`Succesfully kicked ${user.tag}`))
									.catch(console.error);
								message.channel.send(`${member.displayName} ist von der Server geyeetet weil Sie `
									+ `invisible mode benutzen. Sie sind allen gewarnt.`);
							});
				});
			} else {
				message.reply("I can't kick you, but you should be for using invisible mode. Fuck you.");
				console.log(`Unsuccesfully tried to kick ${user.tag}`);
			}
		}
	}
});

// Give the user their nickname and role(s) back on rejoin
// Once the bot restarts, this list will be gone
client.on('guildMemberAdd', (member) => {
	var i = 0;
	var found = false;
	var length = kickedMembers.length;
	while(i < length && !found) {
		// Check if the added user has been kicked recently
		if(kickedMembers[i].user.id === member.user.id) {
			member.setNickname(kickedMembers[i].displayName);
			member.setRoles(kickedMembers[i].roles);
			kickedMembers.splice(i, 1);
			found = true;
			console.log(`Succesfully gave ${member.user.tag} their nickname and roles back`);
		}
		i++;
	}
	if(!found) {
		// TODO: send a warning message in the general chat not to use invisible mode
	}
});

// Read bot token from file system
var fs = require('fs');
var path = require('path');

client.login(
	fs.readFileSync(path.join(__dirname, 'token.txt'), {encoding: 'utf8' })
);
