const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const msg = require('../Functions/msg.js')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('동전던지기')
		.setDescription('동전던지기 게임을 합니다.')
        .addNumberOption(option => option.setName('배팅-금액').setDescription('배팅할 금액').setRequired(true))
        .addStringOption(option =>
            option.setName('결과-선택')
                .setDescription('배팅할 결과')
                .addChoice('앞면', 'front')
                .addChoice('뒷면', 'back')
                .setRequired(true))
        .setDefaultPermission(true),
                

	async execute(interaction, client) {
        //UserData.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/UserData.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);

        //Settings.json 파일 불러오기
        jsonBuffer = fs.readFileSync('./lib/Settings.json')
        dataJson = jsonBuffer.toString();
        var data2 = JSON.parse(dataJson);
        t = data2.t
        if(!(interaction.user.id in data.Users))
        {  
            //가입 되어 있지 않다면 가입
            await join.CreateNewUserData(interaction.user.id, client)
            //Data.json 파일 다시 불러오기
            jsonBuffer = fs.readFileSync('./lib/UserData.json')
            dataJson = jsonBuffer.toString();
            data = JSON.parse(dataJson);
        }
        const batting = interaction.options._hoistedOptions[0].value

        if(batting <= data.Users[interaction.user.id].NormalAccount)
        {
            if(Math.random() >= 0.5)
            {
                //예상 성공
                data.Users[interaction.user.id].NormalAccount += batting + (batting - (batting * t))
                const datastr = JSON.stringify(data, null, '\t');
                fs.writeFileSync('./lib/UserData.json', datastr);

                await msg.moneyalart(client, interaction.user.id, (batting + (batting - (batting * t))), '동전던지기', 1)

                const logmsg = new MessageEmbed()
                    .setTitle('송금 로그')
                    .setDescription(`동전던지기 님이 ${interaction.user.username}#${interaction.user.discriminator} 님에게 ${(batting + (batting - (batting * t)))}원을 송금 했습니다.`)
                    .setColor('#B545F7')
                await msg.log(client, logmsg)

                const embed = new MessageEmbed()
                    .setTitle('예측 성공 ✅')
                    .setDescription(`계좌에 ${batting + (batting - (batting * t))}원 이 입금 되었습니다.`)
                    .setColor('#20E86A')
                await interaction.reply({ embeds: [embed] })
            }
            else
            {
                //예상 실패
                data.Users[interaction.user.id].NormalAccount -= batting
                const datastr = JSON.stringify(data, null, '\t');
                fs.writeFileSync('./lib/UserData.json', datastr);

                await msg.moneyalart(client, interaction.user.id, batting, '동전던지기', 0)

                const logmsg = new MessageEmbed()
                    .setTitle('출금 로그')
                    .setDescription(`동전던지기 님이 ${interaction.user.username}#${interaction.user.discriminator} 님에게 ${batting}원을 출금 했습니다.`)
                    .setColor('#B545F7')
                await msg.log(client, logmsg)

                const embed = new MessageEmbed()
                    .setTitle('예측 실패 ❌')
                    .setDescription(`${batting}원 을 잃었습니다.`)
                    .setColor('#FC5E5B')
                await interaction.reply({ embeds: [embed] })
            }
        }
        else
        {
            //배팅 실패
            const embed = new MessageEmbed()
                .setTitle('배팅 실패 ❌')
                .addField('사유', '잔액이 부족합니다.')
                .setColor('#FC5E5B')
            await interaction.reply({ embeds: [embed] })
        }
    }
}