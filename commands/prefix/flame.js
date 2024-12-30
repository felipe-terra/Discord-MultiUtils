const { EmbedBuilder } = require("discord.js");
const momenttz = require('moment-timezone');

module.exports = {
  name: "flame",
  description: "Mostra informações do player no FlameMC",
  async execute (message, args) {
    try {
      const response = await fetch(`https://www.flamemc.com.br/_next/data/Lid3E1KT0-AQh8ObLLzfQ/player/${args[0]}.json?nick=${args[0]}`, {
      });

      const data = await response.json();
      const player = data.pageProps.player;
      const clan = player.clan || 'Sem Clã'; 
      if (data.pageProps.player === null) return message.reply({ content: `${client.xx?.zwrong || '❌'} Esse **nick** nunca jogou no **Flame** ou não existe.` })
      
      const embed = new EmbedBuilder()
        .setColor('Orange')
        .setAuthor({ name: `${player.name} [${clan}]`, iconURL: 'https://www.flamemc.com.br/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fmain-logo-without-bg.3acfead7.png&w=640&q=75' })
        .setThumbnail('https://mc-heads.net/head/' + player.uuid)
        .addFields(
          {
            name: 'Nick',
            value: `\`\`\`${data.pageProps.player.name}\`\`\``,
            inline: true
          },
          {
            name: 'Rank',
            value: `\`\`\`${data.pageProps.player.rankName}\`\`\``,
            inline: true
          },
          {
            name: 'Tipo de cadastro',
            value: `\`\`\`${data.pageProps.player.premium ? 'Original' : 'Pirata'}\`\`\``,
            inline: true
          }
        )

      // Adicionar estatísticas do HG
      if (data.pageProps.player.realStats.hg) {
        const hgStats = data.pageProps.player.realStats.hg.stats;
        const kills = hgStats.find(s => s.statsMap.name === 'hg_kills')?.value || 0;
        const deaths = hgStats.find(s => s.statsMap.name === 'hg_deaths')?.value || 0;
        const wins = hgStats.find(s => s.statsMap.name === 'hg_wins')?.value || 0;
        const kdr = (kills / (deaths || 1)).toFixed(2);

        embed.addFields({
          name: '🗡️ HG Stats',
          value: `Kills: \`${kills}\`\nMortes: \`${deaths}\`\nVitórias: \`${wins}\`\nKDR: \`${kdr}\``,
          inline: true
        });
      }

      if (data.pageProps.player.realStats.pvp_arena) {
        const arenaStats = data.pageProps.player.realStats.pvp_arena.stats;
        const kills = arenaStats.find(s => s.statsMap.name === 'pvp_arena_kills')?.value || 0;
        const deaths = arenaStats.find(s => s.statsMap.name === 'pvp_arena_deaths')?.value || 0;
        const bestStreak = arenaStats.find(s => s.statsMap.name === 'pvp_arena_best_streak')?.value || 0;
        const kdr = (kills / (deaths || 1)).toFixed(2);

        embed.addFields({
          name: '⚔️ Arena Stats',
          value: `Kills: \`${kills}\`\nMortes: \`${deaths}\`\nMelhor Streak: \`${bestStreak}\`\nKDR: \`${kdr}\``,
          inline: true
        });
      }

      const bedStats = data.pageProps.player.accountStats;
      const hasBedWarsStats = bedStats.some(s => s.statsMap.name.startsWith('bed_wars_'));

      if (data.pageProps.player.realStats.league){
        const wins = data.pageProps.player.realStats.league.stats.find(s => s.statsMap.name === 'league_wins')?.value || 0;
        const kills = data.pageProps.player.realStats.league.stats.find(s => s.statsMap.name === 'league_kills')?.value || 0;
        const deaths = data.pageProps.player.realStats.league.stats.find(s => s.statsMap.name === 'league_deaths')?.value || 0;
        const kdr = (kills / (deaths || 1)).toFixed(2);

        embed.addFields({
          name: '🏆 League Stats',
          value: `Vitórias: \`${wins}\`\nKills: \`${kills}\`\nMortes: \`${deaths}\`\nKDR: \`${kdr}\``,
          inline: true
        });
      }
      

      const timezone = 'America/Sao_Paulo';

      const currentDate = momenttz().tz(timezone);
      const firstLoginDate = momenttz(data.pageProps.player.firstLogin).tz(timezone);
      const firstLogin = firstLoginDate.locale('pt-br').format("DD [de] MMMM [de] YYYY, [às] HH:mm");
      const firstLoginDiff = momenttz.duration(currentDate.diff(firstLoginDate));
      const firstLoginFormatedDiff = formatTimeDuration(firstLoginDiff);

      const lastLoginDate = momenttz(data.pageProps.player.lastLogin).tz(timezone);
      const lastLogin = lastLoginDate.locale('pt-br').format("DD [de] MMMM [de] YYYY, [às] HH:mm");
      const lastLoginDiff  = momenttz.duration(currentDate.diff(lastLoginDate));
      const lastLoginFormatedDiff = formatTimeDuration(lastLoginDiff);


      if (data.pageProps.player.firstLogin) {
        embed.addFields({
          name: `Primeiro login registrado`,
          value: `${firstLogin} **(${firstLoginFormatedDiff})**`,
          inline: false
        })
      }

      if (data.pageProps.player.lastLogin) {
        embed.addFields({
          name: `Ultimo login registrado`,
          value: `${lastLogin} **(${lastLoginFormatedDiff})**`,
          inline: false
        })
      }

      await message.reply({ embeds: [embed] })
    } catch (error) {
      console.error('Erro ao consultar API externa:', error);
    }
  }
}

formatTimeDuration = function(duration) {
  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  let parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'ano' : 'anos'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  } else if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'mês' : 'meses'}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  } else if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
    if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  } else if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
    if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  } else if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
    if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);
  } else {
    parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);
  }

  return parts.join(" ");
}


