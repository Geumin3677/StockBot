const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('내주식')
		.setDescription('나의 주식을 확인합니다')
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
            //Companys.json 파일 불러오기
            const jsonBuffer = fs.readFileSync('./lib/Companys.json')
            const dataJson = jsonBuffer.toString();
            const data2 = JSON.parse(dataJson);
            var message = '```xl\n■ 일반 주식\n'
            var check = true
            for(const company of Object.keys(data.Users[interaction.user.id].StockAccount.stock))
            {
                if(data.Users[interaction.user.id].StockAccount.stock[company].cnt != 0)
                {
                    check = false
                    message += '● '
                    message += company
                    message += '   '
                    message += `${data.Users[interaction.user.id].StockAccount.stock[company].cnt}주   수익률  `
                    message += `${Math.floor((data2.Companys[company].price * data.Users[interaction.user.id].StockAccount.stock[company].cnt) / (data.Users[interaction.user.id].StockAccount.stock[company].principal) * 100)}%   손익   `
                    message += `${(data2.Companys[company].price * data.Users[interaction.user.id].StockAccount.stock[company].cnt) - data.Users[interaction.user.id].StockAccount.stock[company].principal}원\n`
                }
            }
            if(check)
            {
                message += '보유하고 있는 주식이 없습니다.'
            }
            message += '\n\n■ 선물 주식\n'
            check = true
            for(const company of Object.keys(data.Users[interaction.user.id].StockAccount.ftstock))
            {
                const ftstock = data.Users[interaction.user.id].StockAccount.ftstock[company]
                if(ftstock.cnt != 0)
                {
                    check = false
                    if(ftstock.position == 'long')
                    {
                        message += `● ${company}   ${ftstock.cnt}주   ${ftstock.position}   ${ftstock.drain}배수   수익률 ${Math.floor((((((ftstock.cnt * data2.Companys[company].price) - ftstock.principal) * ftstock.drain) + ftstock.principal) / ftstock.principal) * 100)}%   손익 ${(((ftstock.cnt * data2.Companys[company].price) - ftstock.principal) * ftstock.drain)}`                         
                    }
                    else
                    {
                        message += `● ${company}   ${ftstock.cnt}주   ${ftstock.position}   ${ftstock.cnt}배수   수익률 ${Math.floor(((-(((ftstock.cnt * data2.Companys[company].price) - ftstock.principal) * ftstock.drain) + ftstock.principal) / ftstock.principal) * 100)}%   손익 ${-(((ftstock.cnt * data2.Companys[company].price) - ftstock.principal) * ftstock.drain)}`
                    }
                }
            }
            if(check)
            {
                message += '보유하고 있는 선물 거래 주식이 없습니다.'
            }

            message += '\n```'
            await interaction.reply(message);
        }
    }
}