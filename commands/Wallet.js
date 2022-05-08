const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('지갑')
		.setDescription('나의 보유 자금을 확인합니다')
        .setDefaultPermission(true),

	async execute(interaction, client) {
        //UserData.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/UserData.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);
        if(!interaction.user.id in data.Users)
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
            //만약 가입 되어있다면 프로필 전송
            var NormalAccount = data.Users[interaction.user.id].NormalAccount
            var StockAccount = data.Users[interaction.user.id].StockAccount.deposit
            const embed = new MessageEmbed()
                .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 지갑`)
                .setThumbnail(interaction.user.displayAvatarURL())
                .addField('총 보유 자산', `${NormalAccount + StockAccount}원`, false)
                .addField('일반 계좌', `${NormalAccount}원`, true)
                .addField('주식 계좌', `${StockAccount}원`, true)
                .setColor('#315CE8')
            await interaction.reply({ embeds: [embed] })
        }
	},
};