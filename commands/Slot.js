const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const slot = require('../Functions/slot-machine.js')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('슬롯')
		.setDescription('슬롯(룰렛)을 돌립니다')
        .setDefaultPermission(true)
        .addNumberOption(option => option.setName('배팅-금액').setDescription('배팅할 금액').setRequired(true)),

	async execute(interaction, client) {
        //UserData.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/UserData.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);
        if(!(interaction.user.id in data.Users))
        {  
            //가입 되어 있지 않다면 가입
            await join.CreateNewUserData(interaction.user.id, client)
            //Data.json 파일 다시 불러오기
            jsonBuffer = fs.readFileSync('./lib/UserData.json')
            dataJson = jsonBuffer.toString();
            data = JSON.parse(dataJson);
        }
        else
        {
            const batting = interaction.options._hoistedOptions[0].value
            const embed2 = new MessageEmbed()
                .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 슬롯`)
                .setDescription(`**------------------------------------
                |◾❓◾|◾❓◾|◾❓◾|
                ------------------------------------
                ---------- PREPARING ----------**`)
                .setColor('#20E86A')
            await interaction.reply({ embeds: [embed2] })
            const slotmsg = await interaction.fetchReply()
            slot.slott(slotmsg, batting, interaction, client)
        }
    }
}