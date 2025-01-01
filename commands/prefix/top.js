const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "top",
    description: "Mostra o top 10 do FlameMC para o modo especificado",
    async execute(message, args) {
        try {
            const modos = {
                hg: { statId: 19, title: 'Top 10 do HG da season', expStat: 'hg_exp', winsStat: 'hg_wins' },
                fl: { statId: 25, title: 'Top 10 da Flame League da season', expStat: 'league_exp', winsStat: 'league_wins' },
                cxc: { statId: 30, title: 'Top 10 do CxC da season', expStat: 'competitive_exp', winsStat: 'competitive_wins' },
                arena: { statId: 6, title: 'Top 10 do PvP Arena da season', expStat: 'pvp_exp', winsStat: 'pvp_arena_best_streak' },
            };

            const argument = args[0]?.toLowerCase();

            if (!argument || !modos[argument]) {
                return message.reply('Por favor, forneça um modo de jogo válido após o comando top. Modos válidos: hg, fl.');
            }

            const { statId, title, expStat, winsStat } = modos[argument];

            const response = await fetch(`http://api.flamemc.com.br/leaderboards/monthly?statId=${statId}&size=100`);
            const data = await response.json();

            const leaderboard = data;
            if (!leaderboard || !Array.isArray(leaderboard)) {
                return message.reply('Não foi possível obter o top 10. Tente novamente mais tarde.');
            }


            const top10 = leaderboard.slice(0, 10);

        
            const embed = new EmbedBuilder()
            .setColor('Orange')
            .setTitle(title)
            .setDescription(top10.map(player => {
                const rank = player.position;
                const name = player.name;
                const clan = player.clan || 'Sem Cla';
                const exp = player.accountStatsMonthly.find(stat => stat.statsMap.name === expStat)?.value || 0;
                const wins = player.accountStatsMonthly.find(stat => stat.statsMap.name === winsStat)?.value || 0;
                return `${rank}. **${name}** [${clan}] - EXP: ${exp} - ${argument === "arena" ? "Best Streak" : "Wins"}: ${wins}`;
            }).join('\n'));

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao buscar dados do FlameMC:', error);
            message.reply('Ocorreu um erro ao buscar o top 10. Tente novamente mais tarde.');
        }
    }
}