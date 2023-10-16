const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        client.user.setActivity({
            name: "Lets set a date | /votedate"
        });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};