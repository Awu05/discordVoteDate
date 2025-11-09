const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emotes = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('votedate')
        .setDescription('Replies with dates to vote on!')
        .addStringOption(opt => opt.setName('date').setDescription('Month/Day/Year OR Year/Month/Day').setRequired(true))
        .addStringOption(opt => opt.setName('start').setDescription('Set the start time!').setRequired(true))
        .addStringOption(opt => opt.setName('end').setDescription('Set the end time!').setRequired(true))
        .addStringOption(opt => opt.setName('interval').setDescription('Set the interval time!').setRequired(true))
        .addStringOption(opt => opt.setName('consecutive-days').setDescription('Set consecutive days. Sets one day if not specified.')),

    async execute(interaction) {
        console.log('Interaction received:', interaction.commandName, Date.now());

        // Immediately acknowledge to Discord
        try {
            await interaction.deferReply({ ephemeral: false });
        } catch (err) {
            console.error("Failed to defer:", err);
            return;
        }

        try {
            const date = interaction.options.getString('date');
            const start = parseFloat(interaction.options.getString('start'));
            const end = parseFloat(interaction.options.getString('end'));
            const interval = parseFloat(interaction.options.getString('interval'));
            let consecutiveDays = parseInt(interaction.options.getString('consecutive-days')) || 1;
            if (consecutiveDays <= 0) consecutiveDays = 1;

            for (let i = 0; i < consecutiveDays; i++) {
                const timeArray = [];
                let emojiIndex = 0;

                const result = new Date(date);
                result.setDate(result.getDate() + i);
                result.setHours(result.getHours() + 20);

                for (let j = start; j <= end; j += interval) {
                    timeArray.push({
                        name: j < 0 ? `R ${j} ${emotes[emojiIndex]}` : `R + ${j} ${emotes[emojiIndex]}`,
                        value: ' '
                    });
                    emojiIndex++;
                    if (emojiIndex >= 10) break;
                }

                const embed = new EmbedBuilder()
                    .setTitle(`<t:${Math.floor(result.getTime() / 1000)}:D>`)
                    .setColor(0x0099FF)
                    .setDescription('Please vote on a time!')
                    .setTimestamp()
                    .addFields(timeArray);

                const message = await interaction.followUp({ embeds: [embed], fetchReply: true });

                // 2️⃣ React concurrently instead of one by one
                await Promise.all(
                    emotes.slice(0, emojiIndex).map(e => message.react(e))
                );
            }

            await interaction.editReply({ content: 'Voting messages created!' });

        } catch (err) {
            console.error('Command error:', err);

            // 3️⃣ Handle reply safely depending on state
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({ content: 'There was an error executing this command.' });
                } else {
                    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
                }
            } catch (replyErr) {
                console.error('Error while sending error message:', replyErr);
            }
        }
    },
};
