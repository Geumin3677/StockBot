const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const fs = require('fs')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('도움말')
		.setDescription('도움말')
        .setDefaultPermission(true),
    
    async execute(interaction, client){
        if(interaction.member.permissions.has('ADMINISTRATOR'))
        {
            interaction.reply({ content: '성공' })
            interaction.deleteReply()
            const embed = new MessageEmbed()
                .setColor('PURPLE')
                .setTitle('도움말')
                .setDescription('설명 작성')
            interaction.channel.send({ embeds: [embed] })
        }
        else
        {
            interaction.reply({ content: `권한이 없습니다.`, ephemeral: true })
            return 
        }
    }
}