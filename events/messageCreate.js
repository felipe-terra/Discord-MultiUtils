module.exports = {
    name: 'messageCreate',
    execute(client) {
        client.on('messageCreate', async (message) => {
            if (!message || !message.author) return;
            if (message.author.bot) return;
            if (!message.content.startsWith('f!')) return;

            try {
                const args = message.content.slice(2).split(' ');
                const commandName = args.shift().toLowerCase();

                const command = client.commands.get(commandName)
                    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

                if (!command) return message.reply('Comando não encontrado');

                try {
                    await command.execute(message, args);
                    console.log(`Command ! ${commandName} executed by ${message.author.username}`);
                } catch (error) {
                    console.error(`Error executing command ! ${commandName}:`, error);
                    message.reply('Ocorreu um erro ao executar o comando');
                }
            } catch (error) {
                console.error('Error in messageCreate event:', error);
            }
        });
    }
};
