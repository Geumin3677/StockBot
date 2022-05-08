const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('지연 시간을 측정합니다')
		.setDefaultPermission(false),

	async execute(interaction) {
		await interaction.reply(`Pong! ${interaction.createdTimestamp - Date.now()}ms`);
	},
};