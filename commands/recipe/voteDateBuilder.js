const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('votedate')
        .setDescription('Replies with dates to vote on!')
        .addStringOption(opt =>
            opt.setName('date')
                .setDescription('Month/Day/Year or Year/Month/Day')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('start')
                .setDescription('Start time')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('end')
                .setDescription('End time')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('interval')
                .setDescription('Interval time')
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName('consecutive-days')
                .setDescription('Number of consecutive days (default 1)')),

    async execute(interaction) {
        // 🚨 MUST happen within 3 s — put it at the very top!
        await interaction.deferReply(); // public response

        try {
            const date = interaction.options.getString('date');
            const start = parseFloat(interaction.options.getString('start'));
            const end = parseFloat(interaction.options.getString('end'));
            const interval = parseFloat(interaction.options.getString('interval'));
            let consecutiveDays = parseInt(interaction.options.getString('consecutive-days') || '1', 10);

            const emotes = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

            // optional quick feedback
            await interaction.editReply(`Generating ${consecutiveDays} vote embed(s)…`);

            for (let i = 0; i < consecutiveDays; i++) {
                const result = new Date(date);
                result.setDate(result.getDate() + i);

                const fields = [];
                for (let j = start, k = 0; j <= end && k < emotes.length; j += interval, k++) {
                    fields.push({ name: `Option ${emotes[k]}`, value: `${j}`, inline: true });
                }

                const embed = new EmbedBuilder()
                    .setTitle(`<t:${Math.floor(result.getTime() / 1000)}:D>`)
                    .setColor('Blue')
                    .addFields(fields);

                const msg = await interaction.followUp({ embeds: [embed] });
                for (const e of emotes.slice(0, fields.length)) msg.react(e).catch(console.error);
            }

            await interaction.followUp({ content: '✅ All vote messages created!', flags: 64 });

        } catch (err) {
            console.error('VoteDate error:', err);

            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: 'There was an error executing the command.', flags: 64 }).catch(() => { });
            } else {
                await interaction.reply({ content: 'There was an error executing the command.', flags: 64 }).catch(() => { });
            }
        }
    },
};
