const colors = require('colors');

module.exports = (client) => {
	client.user.setPresence({ status: 'online' });

	let allMembers = new Set();
	client.guilds.cache.forEach((guild) => {
		guild.members.cache.forEach((member) => {
			allMembers.add(member.user.id);
		});
	});

	let allChannels = new Set();
	client.guilds.cache.forEach((guild) => {
		guild.channels.cache.forEach((channel) => {
			allChannels.add(channel.id);
		});
	});

	console.log(
		` ${client.guilds.cache.size} servers `.magenta,
		` ${client.channels.cache.size} channels `.magenta,
		` ${allMembers.size} members `.magenta
	);
};
