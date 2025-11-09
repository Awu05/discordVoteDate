const { Events } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        console.log('Interaction created:', {
            commandName: interaction.commandName,
            user: interaction.user?.tag,
            id: interaction.id,
            appId: interaction.applicationId,
            clientId: interaction.client.user.id,
            createdTimestamp: interaction.createdTimestamp,
            receivedAt: Date.now()
        });

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error('Command error:', error);
            try {
                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({ content: 'There was an error executing this command.', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
                }
            } catch (nestedErr) {
                console.error('Error while sending error message:', nestedErr);
            }
        }
    },
};