const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('매도')
		.setDescription('특정 회사의 주식을 매도합니다.')
        .setDefaultPermission(true)
        .addStringOption(option => option.setName('회사-이름').setDescription('매도할 회사의 이름').setRequired(true))
        .addNumberOption(option => option.setName('매도-금액').setDescription('매도할 주식 개수').setRequired(true)),

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
            const company = interaction.options._hoistedOptions[0].value
            const value = interaction.options._hoistedOptions[1].value

            //Companys.json 파일 불러오기
            const jsonBuffer = fs.readFileSync('./lib/Companys.json')
            const dataJson = jsonBuffer.toString();
            const data2 = JSON.parse(dataJson);

            //주식을 가지고 있는지 검색
            if(company in data.Users[interaction.user.id].StockAccount.stock)
            {
                if(data.Users[interaction.user.id].StockAccount.stock[company].cnt >= value)
                {
                    //Settings.json 파일 불러오기
                    const jsonBuffer = fs.readFileSync('./lib/Settings.json')
                    const dataJson = jsonBuffer.toString();
                    const data3 = JSON.parse(dataJson);

                    data.Users[interaction.user.id].StockAccount.stock[company].cnt -= value
                    data.Users[interaction.user.id].StockAccount.deposit += (data2.Companys[company].price * value) * (1-data3.t)

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/UserData.json', datastr);

                    const embed = new MessageEmbed()
                        .setTitle('매도 성공 ✅')
                        .setDescription(`${company} ${value}주 매도 하셨습니다.`)
                        .addField('주식 계좌 잔액', `${data.Users[interaction.user.id].StockAccount.deposit}원`, true)
                        .addField('수익률', `${Math.floor((data2.Companys[company].price * value) / (data.Users[interaction.user.id].StockAccount.stock[company].principal) * 100)}%`, true)
                        .addField('손익', `${(data2.Companys[company].price * value) - data.Users[interaction.user.id].StockAccount.stock[company].principal}원`, true)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                else
                {
                    const embed = new MessageEmbed()
                        .setTitle('매도 실패 ❌')
                        .addField('사유', '주식이 부족합니다.')
                        .setColor('#FC5E5B')
                    await interaction.reply({ embeds: [embed] });
                }
            }
            else
            {
                const embed = new MessageEmbed()
                    .setTitle('매도 실패 ❌')
                    .addField('사유', '주식을 가지고 있지 않습니다.')
                    .setColor('#FC5E5B')
                await interaction.reply({ embeds: [embed] });
            }
        }
    }
}