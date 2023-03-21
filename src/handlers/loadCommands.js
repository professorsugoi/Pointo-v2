const { recursiveReadDirSync } = require('@helpers/Utils');
const path = require('path');
const ascii = require('ascii-table');

function loadCommands(client) {
	let slash = [];

	const table = new ascii().setHeading('Slash Commands', '');

	const commandPath = 'src/commands';
	const commandFiles = recursiveReadDirSync(commandPath);

	for (const filePath of commandFiles) {
		const command = require(filePath);
		const file = path.basename(filePath);

		if (command.name) {
			client.slash.set(command.name, command);
			slash.push(command);
			table.addRow(file, '✓');
		} else {
			table.addRow(file, 'X => Missing a help.name or help.name is not in string');
			continue;
		}
	}
	console.log(table.toString());

	client.on('ready', async () => {
		await client.application.commands.set(slash);
	});
}

module.exports = {
	loadCommands,
};
