const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const fs = require('fs');
const join = require('../Functions/Newbie.js')
const msg = require('../Functions/msg.js')
const { time } = require('@discordjs/builders')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('마권-구입')
		.setDescription('마권을 구입합니다.')
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

		jsonBuffer = fs.readFileSync('./lib/Game.json')
        dataJson = jsonBuffer.toString();
        var data2 = JSON.parse(dataJson);

		jsonBuffer = fs.readFileSync('./lib/Settings.json')
        dataJson = jsonBuffer.toString();
        var data3 = JSON.parse(dataJson);

		if(!(interaction.user.id in data2.horse_racing.Participants))
		{
			data2.horse_racing.Participants[interaction.user.id] = {
				name : `${interaction.user.username}#${interaction.user.discriminator}`,
				text : `${Object.keys(data2.horse_racing.Participants).length + 1}번 🏇 - ${interaction.user.username}#${interaction.user.discriminator}`
			}

			data2.horse_racing.list += `${Object.keys(data2.horse_racing.Participants).length}번 🏇 - ${interaction.user.username}#${interaction.user.discriminator}\n`

			var datastr = JSON.stringify(data2, null, '\t');
			fs.writeFileSync('./lib/Game.json', datastr);

			data.Users[interaction.user.id].NormalAccount -= 1500
			datastr = JSON.stringify(data, null, '\t')
			fs.writeFileSync('./lib/UserData.json', datastr)

			await msg.moneyalart(client, interaction.user.id, 1500, '경마', 0)

			if(Object.keys(data2.horse_racing.Participants).length == data3.horse)
			{
				function makeRandom(min, max){
					var RandVal = Math.floor(Math.random()*(max-min+1)) + min;
					return RandVal;
				}

				const embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('마권 구입 성공')
					.setDescription(`${data2.horse_racing.list}\n${Object.keys(data2.horse_racing.Participants).length}번 말이 당신의 말입니다.\n입장료 15000원이 부과 되었습니다.`)
				interaction.reply({ embeds: [embed] });

				const date = new Date();
				date.setMinutes(date.getMinutes() + 15)
				const relative = time(date, 'R');

				const embed2 = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('경마 시작')
					.setDescription(`${data2.horse_racing.list}\n결과 발표 시간 - ${relative}`)
				interaction.channel.send({ embeds: [embed2] });

				setTimeout(async function() {
					function shuffle(array) { array.sort(() => Math.random() - 0.5); }
					var rank = []

					var a = 0
					while (a < Object.keys(data2.horse_racing.Participants).length) {
						rank.push(a)
						a += 1
					}

					shuffle(rank)

					var list = ""
					var b = 0
					while (b < Object.keys(data2.horse_racing.Participants).length) {
						switch(b)
						{
							case 0:
								list += '🥇 '
								break
							case 1:
								list += '🥈 '
								break
							case 2:
								list += '🥉 '
								break
							default:
								list += '⬛ '
								break
						}
						list += `${data2.horse_racing.Participants[Object.keys(data2.horse_racing.Participants)[rank[b]]].text}\n`
						b += 1
					}

					var reward = []
					const cnt = (Object.keys(data2.horse_racing.Participants).length * 1500)

					reward.push(cnt * (0.01 * data3.horse_per.st))
					reward.push(cnt * (0.01 * data3.horse_per.nd))
					reward.push(cnt * (0.01 * data3.horse_per.th))

					data.Users[Object.keys(data2.horse_racing.Participants)[rank[0]]].NormalAccount += reward[0]
					data.Users[Object.keys(data2.horse_racing.Participants)[rank[1]]].NormalAccount += reward[1]
					data.Users[Object.keys(data2.horse_racing.Participants)[rank[2]]].NormalAccount += reward[2]
					datastr = JSON.stringify(data, null, '\t')
					fs.writeFileSync('./lib/UserData.json', datastr)

					await msg.moneyalart(client, Object.keys(data2.horse_racing.Participants)[rank[0]], reward[0], '경마', 1)
					await msg.moneyalart(client, Object.keys(data2.horse_racing.Participants)[rank[1]], reward[1], '경마', 1)
					await msg.moneyalart(client, Object.keys(data2.horse_racing.Participants)[rank[2]], reward[2], '경마', 1)

					data2.horse_racing.Participants = {}
					data2.horse_racing.list = ""
					datastr = JSON.stringify(data2, null, '\t')
					fs.writeFileSync('./lib/Game.json', datastr)

					const embed2 = new MessageEmbed()
						.setColor('#0099ff')
						.setTitle('경마 종료')
						.setDescription(`${list}\n1등 - ${reward[0]}\n2등 - ${reward[1]}\n3등 - ${reward[2]}\n상금이 지급 되었습니다.`)
					interaction.channel.send({ embeds: [embed2] });
				}, (1 * 60000));
			}
			else
			{
				const embed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle('마권 구입 성공')
					.setDescription(`${data2.horse_racing.list}\n${Object.keys(data2.horse_racing.Participants).length}번 말이 당신의 말입니다.\n입장료 15000원이 부과 되었습니다.\n남은 인원 - ${data3.horse - Object.keys(data2.horse_racing.Participants).length}`)
				interaction.reply({ embeds: [embed] });
			}
		}
		else if (Object.keys(data2.horse_racing.Participants).length == data3.horse)
		{
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('마권 구입 실패')
				.setDescription(`경마가 진행중 입니다.`)
			interaction.reply({ embeds: [embed] });
		}
		else
		{
			const embed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle('마권 구입 실패')
				.setDescription(`이미 마권을 구입 하셨습니다`)
			interaction.reply({ embeds: [embed] });
		}
    }
}