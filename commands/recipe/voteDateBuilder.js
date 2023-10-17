const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emotes = [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '🔟',
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('votedate')
        .setDescription('Replies with dates to vote on!')
        .addStringOption(option =>
            option.setName('date')
                .setDescription('Month/Day/Year OR Year/Month/Day')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('start')
                .setDescription('Set the start time!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end')
                .setDescription('Set the end time!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('interval')
                .setDescription('Set the interval time!')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('consecutive-days')
                .setDescription('Set consecutive days. Sets one day if not specified.'))
    ,
    async execute(interaction) {
        const date = interaction.options.getString('date');
        const start = parseFloat(interaction.options.getString('start'));
        const end = parseFloat(interaction.options.getString('end'));
        const interval = parseFloat(interaction.options.getString('interval'));
        let consecutiveDays = interaction.options.getString('consecutive-days') != null ? parseInt(interaction.options.getString('consecutive-days')) : 1;

        if (consecutiveDays <= 0) consecutiveDays = 1;

        for (let i = 0; i < consecutiveDays; i++) {
            const timeArray = [];
            let emojiIndex = 0;
            var result = new Date(date);
            result.setDate(result.getDate() + i);

            for (let j = start; j < end; j += interval) {
                timeArray.push(
                    {
                        name: j < 0 ? `R ${j} ${emotes[emojiIndex]}` : `R + ${j} ${emotes[emojiIndex]}`,
                        value: ' '
                    }
                );
                emojiIndex++;
                if (emojiIndex >= 10) break;
            }

            const embed = new EmbedBuilder()
                .setTitle(`<t:${Math.floor(result.getTime() / 1000)}:F>`)
                .setColor(0x0099FF)
                .setDescription('Please vote on a time!')
                .setTimestamp(Date.now())
                .addFields(timeArray);

            const message = i === 0 ? 
                await interaction.reply({ embeds: [embed], fetchReply: true }) : 
                await interaction.followUp({ embeds: [embed], fetchReply: true });
            for(let k = 0; k < emojiIndex; k++) {
                message.react(emotes[k]);
            }
        }
    },
};