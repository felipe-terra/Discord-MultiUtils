module.exports = (client) => {
    client.on('ready', () => {
        console.log(`Bot está online! Logado como ${client.user.tag}`);
        
        // Definindo o status do bot
        client.user.setActivity('O', { type: 'PLAYING' });
    });
}; 