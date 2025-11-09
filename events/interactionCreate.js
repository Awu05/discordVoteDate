module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Only handle chat input (slash) commands
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            // Execute the command
            await command.execute(interaction);

        } catch (error) {
            console.error('Command error:', error);

            try {
                // If already deferred or replied, send a followUp; otherwise reply
                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({
                        content: 'There was an error executing this command.',
                        flags: 64, // ephemeral
                    });
                } else {
                    await interaction.reply({
                        content: 'There was an error executing this command.',
                        flags: 64, // ephemeral
                    });
                }
            } catch (nestedErr) {
                console.error('Error sending error message:', nestedErr);
            }
        }
    },
};
