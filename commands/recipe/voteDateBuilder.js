const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const emotes = [
    '0️⃣',
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
        .addStringOption(o => o.setName('date').setDescription('Month/Day/Year OR Year/Month/Day').setRequired(true))
        .addStringOption(o => o.setName('start').setDescription('Set the start time!').setRequired(true))
        .addStringOption(o => o.setName('end').setDescription('Set the end time!').setRequired(true))
        .addStringOption(o => o.setName('interval').setDescription('Set the interval time!').setRequired(true))
        .addStringOption(o => o.setName('consecutive-days').setDescription('Set consecutive days. Sets one day if not specified.')),

    async execute(interaction) {
        console.log('Interaction received:', interaction.commandName, Date.now());

        try {
            await interaction.deferReply({ ephemeral: false });

            const date = interaction.options.getString('date');
            const start = parseFloat(interaction.options.getString('start'));
            const end = parseFloat(interaction.options.getString('end'));
            const interval = parseFloat(interaction.options.getString('interval'));
            let consecutiveDays = parseInt(interaction.options.getString('consecutive-days') ?? '1');
            if (consecutiveDays <= 0) consecutiveDays = 1;

            const embeds = [];

            for (let i = 0; i < consecutiveDays; i++) {
                const timeArray = [];
                let emojiIndex = 0;
                const result = new Date(date);
                result.setDate(result.getDate() + i);
                result.setHours(result.getHours() + 20);

                for (let j = start; j <= end; j += interval) {
                    timeArray.push({
                        name: j < 0 ? `R ${j} ${emotes[emojiIndex]}` : `R + ${j} ${emotes[emojiIndex]}`,
                        value: ' ',
                    });
                    emojiIndex++;
                    if (emojiIndex >= 10) break;
                }

                const embed = new EmbedBuilder()
                    .setTitle(`<t:${Math.floor(result.getTime() / 1000)}:D>`)
                    .setColor(0x0099FF)
                    .setDescription('Please vote on a time!')
                    .setTimestamp(Date.now())
                    .addFields(timeArray);

                embeds.push(embed);
            }

            const sentMsg = await interaction.editReply({ content: 'Voting messages created!', embeds });

            // react to the message only once, not per embed
            for (let k = 0; k < embeds[0].data.fields.length && k < emotes.length; k++) {
                await sentMsg.react(emotes[k]);
            }

        } catch (err) {
            console.error('Command error:', err);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'There was an error while executing this command.',
                    ephemeral: true,
                });
            }
        }
    }
};