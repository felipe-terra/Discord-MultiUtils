module.exports = {
    name: 'ping',
    description: 'Responde com Pong!',
    aliases: ['p'],
    async execute(message, args) {
        message.reply('Pong! 🏓');
    }
};