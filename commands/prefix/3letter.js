const puppeteer = require('puppeteer');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: '3letter',
    description: 'Responde com os nicks de 3 letras',
    async execute(message, args) {
        try {
            const loadingMsg = await message.channel.send('🔍 Buscando nicks disponíveis...');

            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();

            await page.goto('https://3name.xyz/list');
            const nicks = await page.evaluate(() => {
                const droppingSoonSection = Array.from(document.querySelectorAll('h2')).find(h2 => h2.textContent.includes('Dropping Soon'));
                if (!droppingSoonSection) return [];
                
                const nickElements = [];
                const nickLinks = droppingSoonSection.parentElement.querySelectorAll('a[href^="/name/"]');
                
                nickLinks.forEach(link => {
                    const nick = link.getAttribute('href').replace('/name/', '');
                    
                    const timeSpan = link.nextElementSibling;
                    const dropTime = timeSpan && timeSpan.classList.contains('timer-description') 
                        ? timeSpan.textContent.trim()
                        : 'Em breve';
                    
                    if (nick && nick.length <= 4) {
                        nickElements.push(`\`Nick: ${nick}\`\n\`Drop in: ${dropTime}\``);
                    }
                });
                
                return nickElements;
            });

            

            await browser.close();

            if (nicks.length === 0) {
                const errorEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('❌ Nenhum nick encontrado')
                    .setDescription('Não há nicks de 3 letras disponíveis no momento.')
                    .setTimestamp();

                await loadingMsg.edit({ content: null, embeds: [errorEmbed] });
                return;
            }

            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('📋 Nicks de 3 letras disponíveis')
                .setDescription(nicks.join('\n'))
                .setFooter({ 
                    text: `Solicitado por ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setURL('https://3name.xyz/list');

            await loadingMsg.edit({ content: null, embeds: [embed] });

        } catch (error) {
            console.error('Erro ao buscar nicks:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erro ao buscar nicks')
                .setDescription('Ocorreu um erro ao buscar os nicks. Tente novamente mais tarde.')
                .setTimestamp();

            await message.channel.send({ embeds: [errorEmbed] });
        }
    }
};