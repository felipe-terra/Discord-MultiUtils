const { EmbedBuilder } = require('discord.js');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: "poke",
    description: "Get some poke info",
    async execute(message, args) {
        try{

            const pokemonName = args[0]

            if(!pokemonName) return message.channel.send('Por favor, forneça o nome de um pokemon para realizar a busca');

            const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
            .then(response => response.json())

            const embed = new EmbedBuilder()
            .setColor('#000000')
            .setTitle(`Consulta de ${pokemonName}`)
            .addFields({ name: 'Height', value: `${pokemon.height/10}m` })
            .addFields({ name: 'Weight', value: `${pokemon.weight/10}kg` })
            .addFields({ name: 'Type:', value: `${pokemon.types.map(typeInfo => typeInfo.type.name).join(' / ')}` })
            .addFields({ name: 'Pokedex Number', value: `${pokemon.id}` })
            .setImage(pokemon.sprites.front_default)
            .setTimestamp()
            .setFooter({ text: 'Pokemon!', iconURL: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' });
            
            const button = new ButtonBuilder()
            .setLabel('Ver mais')
            .setStyle(ButtonStyle.Link)
            .setURL(`https://www.pokemon.com/br/pokedex/${pokemonName.toLowerCase()}`);

            const row = new ActionRowBuilder().addComponents(button);

            await message.channel.send({ embeds: [embed], components: [row] });

        } catch (error) {
            console.error(error);
            message.channel.send('Ocorreu um erro ao buscar o pokemon, verifique se o nome está correto!');
        }
    }
}