
const { EmbedBuilder } = require('discord.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'pokemon',
    description: 'Responde com um pokemon aleatório',
    async execute(message, args) {
        try{
            const pokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
            .then(response => response.json())
            .then(data => data.results[Math.floor(Math.random() * data.results.length)].name)

            const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
            .then(response => response.json())





            const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(`${pokemon.charAt(0).toUpperCase() + pokemon.slice(1)}`)
            .addFields({ name: 'Altura', value: `${pokemonData.height/10}m` })
            .addFields({ name: 'Peso', value: `${pokemonData.weight/10}kg` })
            .addFields({ name: 'Tipagem', value: `${pokemonData.types.map(typeInfo => typeInfo.type.name).join(' / ')}` })
            .addFields({ name: 'Pokedex Number', value: `${pokemonData.id}` })
            .setImage(pokemonData.sprites.front_default)
            .setTimestamp()
            .setFooter({ text: 'Powered by Me', iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' });

        // Cria um botão
        const button = new ButtonBuilder()
            .setEmoji('🔥')
            .setCustomId('collect')
            .setLabel('Clique aqui!')
            .setStyle('Secondary');

        const row = new ActionRowBuilder().addComponents(button);

        const sentMessage = await message.reply({ embeds: [embed], components: [row] });

        let isCaptured = false;

        // Cria um coletor de interações para o botão
        const filter = i => i.customId === 'collect' && !i.user.bot;
        const collector = sentMessage.createMessageComponentCollector({ filter, max: 1, time: 50000 });

        collector.on('collect', async i => {
            if (i.customId === 'collect') {
                isCaptured = true;
                await i.reply({ content: `O Usuario ${i.user.tag} (ID: ${i.user.id}) foi o primeiro a reagir!`, components: [] });
            }else if(isCaptured){
                await i.reply({ content: 'Este Pokémon já foi capturado por outro usuário!', ephemeral: true });
            }
        });

        }catch(error){
            console.error(error);
            message.reply('Ocorreu um erro ao buscar o pokemon.');
        }
    }
};