const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "hgtop",
    description: "Mostra o top 10 do FlameMC",
    async execute(message, args) {
        try {
            const response = await fetch('http://api.flamemc.com.br/leaderboards/monthly?statId=19&size=100');
            const data = await response.json();

            const leaderboard = data;
            if (!leaderboard || !Array.isArray(leaderboard)) {
                return message.reply('Não foi possível obter o top 10. Tente novamente mais tarde.');
            }

            const top10 = leaderboard.slice(0, 10);

            const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle('Top 10 do FlameMC')
                .setDescription(top10.map(player => {
                    const rank = player.position;
                    const name = player.name;
                    const clan = player.clan || 'Sem Cla';
                    const exp = player.accountStatsMonthly.find(stat => stat.statsMap.name === 'hg_exp')?.value || 0;
                    const wins = player.accountStatsMonthly.find(stat => stat.statsMap.name === 'hg_wins')?.value || 0;
                    return `${rank}. ${name} [${clan}] - EXP: ${exp} - Wins: ${wins}`;
                }).join('\n'));

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao buscar dados do FlameMC:', error);
            message.reply('Ocorreu um erro ao buscar o top 10. Tente novamente mais tarde.');
        }
    }
}