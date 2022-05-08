const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const msg = require('../Functions/msg.js')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('송금')
		.setDescription('특정 대상에게 화폐를 송금 합니다')
        .setDefaultPermission(true)
        .addUserOption(option => option.setName('대상').setDescription('송금 대상').setRequired(true))
        .addNumberOption(option => option.setName('금액').setDescription('대상에게 송금할 금액').setRequired(true)),

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
            var targetId = interaction.options._hoistedOptions[0].user.id
            var value = interaction.options._hoistedOptions[1].value
            var targetName = `${interaction.options._hoistedOptions[0].user.username}#${interaction.options._hoistedOptions[0].user.discriminator}`
            if(!interaction.options._hoistedOptions[0].user.bot)
            {
                //송금 대상이 서비스에 가입 되어있는지 확인
                if(!targetId in data.Users)
                {
                    //가입 되어 있지 않다면 가입
                    await join.CreateNewUserData(interaction.user.id, client)
                    //Data.json 파일 다시 불러오기
                    jsonBuffer = fs.readFileSync('./lib/UserData.json')
                    dataJson = jsonBuffer.toString();
                    data = JSON.parse(dataJson);
                }
                //송금할 돈이 있는지 확인
                if(value <= data.Users[interaction.user.id].NormalAccount)
                {
                    //UserData에서 돈 이동
                    data.Users[interaction.user.id].NormalAccount -= value
                    data.Users[targetId].NormalAccount += value
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/UserData.json', datastr);                     

                    const name = `${interaction.user.username}#${interaction.user.discriminator}`
                    msg.moneyalart(client, targetId, value, name, 1)

                    const logmsg = new MessageEmbed()
                        .setTitle('송금 로그')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${targetName} 님에게 ${value}원을 송금 했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed2 = new MessageEmbed()
                        .setTitle('송금 성공 ✅')
                        .setDescription(`${targetName} 님에게 ${value}원 을 송금했습니다`)
                        .addField('대상', targetName, true)
                        .addField('금액', `${value}원`, true)
                        .setColor('#20E86A')
                    await interaction.reply({ embeds: [embed2] })
                }
                else
                {
                    //송금 실패
                    const embed = new MessageEmbed()
                        .setTitle('송금 실패 ❌')
                        .addField('사유', '잔액이 부족합니다.')
                        .setColor('#FC5E5B')
                    await interaction.reply({ embeds: [embed] })
                }
            }
            else
            {
                //송금 실패
                const embed = new MessageEmbed()
                    .setTitle('송금 실패 ❌')
                    .addField('사유', '봇에게 돈을 송금할수 없습니다')
                    .setColor('#FC5E5B')
                await interaction.reply({ embeds: [embed] })
            }
        }
    }
}