const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('선물거래매수')
		.setDescription('선물 거래를 합니다.')
        .setDefaultPermission(true)
        .addStringOption(option => option.setName('회사-이름').setDescription('매수할 회사의 이름').setRequired(true))
        .addNumberOption(option => option.setName('매수-금액').setDescription('매수할 주식 개수').setRequired(true))
        .addStringOption(option =>
            option.setName('포지션')
                .setDescription('포지션')
                .addChoice('숏', 'short')
                .addChoice('롱', 'long')
                .setRequired(true))
        .addNumberOption(option => option.setName('배수').setDescription('배수').setRequired(true)),

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
        const company = interaction.options._hoistedOptions[0].value
        const value = interaction.options._hoistedOptions[1].value
        const position = interaction.options._hoistedOptions[2].value
        const drain = interaction.options._hoistedOptions[3].value

        //Companys.json 파일 불러오기
        jsonBuffer = fs.readFileSync('./lib/Companys.json')
        dataJson = jsonBuffer.toString();
        const data2 = JSON.parse(dataJson);

        //회사 검색
        if(company in data2.Companys)
        {
            //잔액 확인
            if(data2.Companys[company].price * value <= data.Users[interaction.user.id].StockAccount.deposit)
            {
                if(!(interaction.user.id in data.ft))
                {
                    data.ft.push(interaction.user.id)
                }
                //해당 회사의 주식을 가지고 있다면
                if(company in data.Users[interaction.user.id].StockAccount.ftstock)
                {
                    const embed = new MessageEmbed()
                        .setTitle('선물거래 매수 실패 ❌')
                        .addField('사유', `이미 선물거래 주식을 가지고 있습니다.`, true)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                else
                {
                    data.Users[interaction.user.id].StockAccount.deposit -= data2.Companys[company].price * value
                    data.Users[interaction.user.id].StockAccount.ftstock[company] = {
                        cnt : value,
                        principal : data2.Companys[company].price * value,
                        position : position,
                        drain : drain
                    }

                    data2.Companys[company].buy += 1
                    data2.butcnt += 1

                    datastr = JSON.stringify(data2, null, '\t');
                    fs.writeFileSync('./lib/Companys.json', datastr);

                    datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/UserData.json', datastr);

                    const embed = new MessageEmbed()
                        .setTitle('선물거래 매수 성공 ✅')
                        .setDescription(`${company} ${value}주 ${position} ${drain}배수 매수 하셨습니다.`)
                        .addField('주식 계좌 잔액', `${data.Users[interaction.user.id].StockAccount.deposit}원`, true)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
            }
            else
            {
                //잔액 부족
                const embed = new MessageEmbed()
                    .setTitle('매수 실패 ❌')
                    .addField('사유', '잔액이 부족합니다.')
                    .setColor('#FC5E5B')
                await interaction.reply({ embeds: [embed] })
            }
        }
        else
        {
            //가입 되어 있지 않다면 오류 표출
            const embed = new MessageEmbed()
                .setTitle('매수 실패 ❌')
                .addField('사유', '회사를 찾을수 없습니다.')
                .setColor('#FC5E5B')
            await interaction.reply({ embeds: [embed] });
        }
    }
}