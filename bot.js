require('module-alias/register');

const colors = require('colors');
const fs = require('fs');
const { google } = require('googleapis');
const { Client, Collection, Intents } = require('discord.js');
const { loadEvents } = require('@handlers/loadEvents');
const { loadCommands } = require('@handlers/loadCommands');
const { googleCredentials } = require('@root/credentials');

// bot client
const client = new Client({
	allowedMentions: { parse: ['users', 'roles'] },
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_WEBHOOKS,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_PRESENCES,
	],
});

const auth = new google.auth.GoogleAuth({
	credentials: googleCredentials,
	scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const sheetClient = auth.getClient();
const googleSheets = google.sheets({ version: 'v4', auth: sheetClient });

// google sheets
client.sheetCommands = fs.readdirSync('./src/commands/');
client.slash = new Collection();
client.auth = auth;
client.sheetId = process.env.SPREADSHEETID;
client.googleSheets = googleSheets.spreadsheets;

// load bot modules
loadEvents(client);
loadCommands(client);

// error handling
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Possibly Unhandled Rejection at: Promise', promise, 'reason:', reason.message);
});

// bot login
client.login(process.env.BOTTOKEN).then(() => {
	console.log(` Successfully logged in as: ${client.user.username}#${client.user.discriminator} `.blue);
});
