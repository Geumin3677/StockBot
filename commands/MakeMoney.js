const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const msg = require('../Functions/msg.js')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('지급')
        .setDefaultPermission(false)
		.setDescription('특정 사용자에게 돈을 지급 합니다.')
        .addUserOption(option => option.setName('대상').setDescription('송금 대상').setRequired(true))
        .addNumberOption(option => option.setName('금액').setDescription('지급할 금액').setRequired(true)),

	async execute(interaction, client) {
        //UserData.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/UserData.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);

        var targetId = interaction.options._hoistedOptions[0].user.id
        var value = interaction.options._hoistedOptions[1].value
        var targetName = `${interaction.options._hoistedOptions[0].user.username}#${interaction.options._hoistedOptions[0].user.discriminator}`

        if(!targetId in data.Users)
        {
            //가입 되어 있지 않다면 가입
            await join.CreateNewUserData(interaction.user.id, client)
            //Data.json 파일 다시 불러오기
            jsonBuffer = fs.readFileSync('./lib/UserData.json')
            dataJson = jsonBuffer.toString();
            data = JSON.parse(dataJson);
        }
        data.Users[targetId].NormalAccount += value
        const datastr = JSON.stringify(data, null, '\t');
        fs.writeFileSync('./lib/UserData.json', datastr);                     

        const name = `관리자`
        msg.moneyalart(client, targetId, value, name, 1)

        const logmsg = new MessageEmbed()
            .setTitle('화페 지급 로그')
            .setDescription(`관리자 ${interaction.user.username}#${interaction.user.discriminator} 님이 ${targetName} 님에게 ${value}원을 지급 했습니다.`)
            .setColor('#B545F7')
        await msg.log(client, logmsg)

        const embed2 = new MessageEmbed()
            .setTitle('화페 지급 성공 ✅')
            .setDescription(`${targetName} 님에게 ${value}원 을 송금했습니다`)
            .addField('대상', targetName, true)
            .addField('금액', `${value}원`, true)
            .setColor('#20E86A')
        await interaction.reply({ embeds: [embed2] })
    }
}