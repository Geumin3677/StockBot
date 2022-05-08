const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('changemoney')
		.setDescription('주식계좌 또는 일반계좌로 돈을 송금합니다')
        .addStringOption(option =>
            option.setName('대상')
                .setDescription('송금할 대상')
                .addChoice('일반계좌', 'normal')
                .addChoice('주식계좌', 'stock')
                .setRequired(true))
        .addNumberOption(option => option.setName('금액').setDescription('입금할 금액').setRequired(true))
        .setDefaultPermission(true),

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
            var choice = interaction.options._hoistedOptions[0].value
            var value = interaction.options._hoistedOptions[1].value
            //송금할 돈이 있는지 확인
            switch(choice)
            {
                case 'normal':
                    //주식계좌 -> 일반계좌로 송금
                    //잔액 확인
                    if(value <= data.Users[interaction.user.id].StockAccount.deposit)
                    {
                        data.Users[interaction.user.id].StockAccount.deposit -= value
                        data.Users[interaction.user.id].NormalAccount += value

                        const datastr = JSON.stringify(data, null, '\t');
                        fs.writeFileSync('./lib/UserData.json', datastr);                     

                        const embed2 = new MessageEmbed()
                            .setTitle('송금 성공 ✅')
                            .setDescription(`일반 계좌에 ${value}원 을 송금했습니다`)
                            .addField('금액', `${value}원`, true)
                            .addField('일반 계좌 잔액', `${data.Users[interaction.user.id].NormalAccount}원`, true)
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
                    return 0
                case 'stock':
                    //일반계좌 -> 주식계좌로 송금
                    //잔액 확인
                    if(value <= data.Users[interaction.user.id].NormalAccount)
                    {
                        data.Users[interaction.user.id].NormalAccount -= value
                        data.Users[interaction.user.id].StockAccount.deposit += value
                        
                        const datastr = JSON.stringify(data, null, '\t');
                        fs.writeFileSync('./lib/UserData.json', datastr);                     

                        const embed2 = new MessageEmbed()
                            .setTitle('송금 성공 ✅')
                            .setDescription(`주식 계좌에 ${value}원 을 송금했습니다`)
                            .addField('금액', `${value}원`, true)
                            .addField('주식 계좌 예수금', `${data.Users[interaction.user.id].StockAccount.deposit}원`, true)
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
                    return 0
            }
            if(value <= data.Users[interaction.user.id].NormalAccount)
            {
                //UserData에서 돈 이동
                data.Users[interaction.user.id].NormalAccount -= value
                data.Users[interaction.user.id].NormalAccount += value
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
    }
}