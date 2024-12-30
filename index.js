const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});

// Criando uma nova Collection para os comandos
client.commands = new Collection();

// Carregando os comandos
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/prefix').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/prefix/${file}`);
    client.commands.set(command.name, command);
}

// Carregando os eventos
const messageCreate = require('./events/messageCreate');
const ready = require('./src/events/ready');

// Inicializando os eventos
ready(client);
messageCreate.execute(client);

// Fazendo login com o token
client.login(process.env.TOKEN);
