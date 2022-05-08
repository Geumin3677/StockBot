const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const msg = require('../Functions/msg.js')
const join = require('../Functions/Newbie.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('복권-구입')
		.setDescription('복권을 구입합니다')
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
        if(data.Users[interaction.user.id].NormalAccount >= 1000)
        {
            function shuffle(array) { array.sort(() => Math.random() - 0.5); }

            var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            var rand = []

            shuffle(arr)

            var a = 0
            while(a < 6)
            {
                rand.push(arr[a])
                a += 1
            }

            jsonBuffer = fs.readFileSync('./lib/Lotto.json')
            dataJson = jsonBuffer.toString();
            var data2 = JSON.parse(dataJson);

            data2.Participants.push({
                lotto : rand,
                owner : interaction.user.id
            })
            data2.Money += 1000

            const datastr = JSON.stringify(data2, null, '\t');
            fs.writeFileSync('./lib/Lotto.json', datastr);  

            const embed2 = new MessageEmbed()
                .setTitle('복권 구매 성공 ✅')
                .setDescription(`**${rand[0]}◼${rand[1]}◼${rand[2]}◼${rand[3]}◼${rand[4]}◼${rand[5]}**`)
                .setColor('#20E86A')
            await interaction.reply({ embeds: [embed2] })
        }
    }
}