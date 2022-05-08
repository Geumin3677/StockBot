const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const fs = require('fs');
const join = require('../Functions/Newbie.js')
const msg = require('../Functions/msg.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('러시안룰렛')
		.setDescription('러시안 룰렛 게임을 시작합니다.')
        .setDefaultPermission(true)
        .addNumberOption(option => option.setName('참여-인원수').setDescription('참여 인원수').setRequired(true))
        .addNumberOption(option => option.setName('참여비').setDescription('참여비').setRequired(true)),

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

        //Game.json 파일 불러오기
        jsonBuffer = fs.readFileSync('./lib/Game.json')
        dataJson = jsonBuffer.toString();
        var data2 = JSON.parse(dataJson);

        if(!data2.russian_roulette.is_gaming)
        {
            const num = interaction.options._hoistedOptions[0].value
            const fee = interaction.options._hoistedOptions[1].value
            if(data.Users[interaction.user.id].NormalAccount >= fee)
            {
                if(num === 1)
                {
                    interaction.reply({ content: '게임 참가자는 최소 2명 입니다.', ephemeral: true });
                }
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('join')
                            .setLabel('게임 참가하기')
                            .setStyle('SECONDARY')
                            .setEmoji('👍')
                    );

                const hostname = `${interaction.user.username}#${interaction.user.discriminator}`

                var money = fee
                var deathcnt = 0
                var cnt = 0
                var participantsList = `${hostname}`
                data2.russian_roulette.is_gaming = true
                data2.russian_roulette.participants[interaction.user.id] = {
                    name : hostname,
                    state : false,
                    profileimg : interaction.user.displayAvatarURL()
                }

                var datastr = JSON.stringify(data2, null, '\t');
                fs.writeFileSync('./lib/Game.json', datastr);

                data.Users[interaction.user.id].NormalAccount -= fee
                datastr = JSON.stringify(data, null, '\t')
                fs.writeFileSync('./lib/UserData.json', datastr)

                await msg.moneyalart(client, interaction.user.id, fee, '러시안룰렛', 0)

                const logmsg = new MessageEmbed()
                    .setTitle('출금 로그')
                    .setDescription(`러시안룰렛 님이 ${interaction.user.username}#${interaction.user.discriminator} 님에게 ${fee}원을 출금 했습니다.`)
                    .setColor('#B545F7')
                await msg.log(client, logmsg)

                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('러시안 룰렛')
                    .setDescription(`참가자가 모두 모이면 자동으로 시작합니다.\n\`참여비 - ${fee}원\`\n**👥 참여 인원 [1/${num}]**\n${hostname}`);
                await interaction.reply({ embeds: [embed], components: [row] });

                const filter = i => i.customId === 'join' || i.customId === 'bang';

                const collector = interaction.channel.createMessageComponentCollector({ filter });

                collector.on('collect', async i => {
                    if (i.customId === 'join')
                    {
                        if(data.Users[interaction.user.id].NormalAccount >= fee)
                        {
                            jsonBuffer = fs.readFileSync('./lib/Game.json')
                            dataJson = jsonBuffer.toString();
                            var data3 = JSON.parse(dataJson);

                            if(!i.user.id in data.Users)
                            {  
                                //가입 되어 있지 않다면 가입
                                await join.CreateNewUserData(i.user.id, client)
                                //Data.json 파일 다시 불러오기
                                jsonBuffer = fs.readFileSync('./lib/UserData.json')
                                dataJson = jsonBuffer.toString();
                                data = JSON.parse(dataJson);
                            }

                            if(!(i.user.id in data3.russian_roulette.participants))
                            {
                                namee  = `${i.user.username}#${i.user.discriminator}`
                                participantsList += `\n${namee}`
                                data3.russian_roulette.participants[i.user.id] = {
                                    name : namee,
                                    state : false,
                                    profileimg : i.user.displayAvatarURL()
                                }
                                datastr = JSON.stringify(data3, null, '\t');
                                fs.writeFileSync('./lib/Game.json', datastr)

                                money += fee
                                data.Users[i.user.id].NormalAccount -= fee
                                datastr = JSON.stringify(data, null, '\t')
                                fs.writeFileSync('./lib/UserData.json', datastr)

                                await msg.moneyalart(client, i.user.id, fee, '러시안룰렛', 0)

                                const logmsg = new MessageEmbed()
                                    .setTitle('출금 로그')
                                    .setDescription(`러시안룰렛 님이 ${i.user.username}#${i.user.discriminator} 님에게 ${fee}원을 출금 했습니다.`)
                                    .setColor('#B545F7')
                                await msg.log(client, logmsg)

                                if((Object.keys(data3.russian_roulette.participants).length) === num)
                                {
                                    const row2 = new MessageActionRow()
                                        .addComponents(
                                            new MessageButton()
                                                .setCustomId('bang')
                                                .setStyle('SECONDARY')
                                                .setEmoji('🔫')
                                        );
                                    const embed3 = new MessageEmbed()
                                        .setColor('#3D3E47')
                                        .setTitle('러시안 룰렛')
                                        .setDescription(`**👥 참여 인원 [${(Object.keys(data3.russian_roulette.participants).length)}/${num}]**\n${participantsList}`)
                                        .setAuthor({ name: `🔫 ${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name} 님의 차례 입니다.`, iconURL: (data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].profileimg) })
                                    i.update({ embeds: [embed3], components: [row2] });
                                }
                                else
                                {
                                    const embed2 = new MessageEmbed()
                                        .setColor('#0099ff')
                                        .setTitle('러시안 룰렛')
                                        .setDescription(`참가자가 모두 모이면 자동으로 시작합니다.\n\`참여비 - ${fee}원\`\n**👥 참여 인원 [${(Object.keys(data3.russian_roulette.participants).length)}/${num}]**\n${participantsList}`);
                                    i.update({ embeds: [embed2], components: [row] });
                                }
                            }
                            else
                            {
                                i.reply({ content: '이미 참여 하였습니다.', ephemeral: true });
                            }
                        }
                        else
                        {
                            interaction.reply({ content: '잔액이 부족합니다.', ephemeral: true });
                        }
                    }
                    else if(i.customId === 'bang')
                    {
                        jsonBuffer = fs.readFileSync('./lib/Game.json')
                        dataJson = jsonBuffer.toString();
                        var data3 = JSON.parse(dataJson);
                        //버튼을 누른 사람의 차례가 맞는지 확인
                        if(i.user.id === Object.keys(data3.russian_roulette.participants)[cnt])
                        {
                            if(Math.random() <= 0.16)
                            {
                                //사망
                                data3.russian_roulette.participants[i.user.id].state = true
                                datastr = JSON.stringify(data3, null, '\t');
                                fs.writeFileSync('./lib/Game.json', datastr)

                                deathcnt += 1
                                participantsList = participantsList.replace(`${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name}`, `~~💀 ${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name}~~`)

                                const oldcnt = cnt

                                cnt = 0
                                while((data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].state))
                                {
                                    if(cnt > (num - 1))
                                    {
                                        cnt = 0
                                    }
                                    else
                                    {
                                        cnt += 1
                                    }
                                }

                                if(deathcnt == (num - 1))
                                {
                                    //게임종료
                                    //Game.json 파일 불러오기
                                    jsonBuffer = fs.readFileSync('./lib/Settings.json')
                                    dataJson = jsonBuffer.toString();
                                    var data4 = JSON.parse(dataJson);
                                    const reward = (money - (money * data4.t))

                                    const row = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('bang')
                                            .setStyle('SECONDARY')
                                            .setLabel('-')
                                            .setDisabled(true)
                                        );

                                    data.Users[Object.keys(data3.russian_roulette.participants)[cnt]].NormalAccount += reward
                                    datastr = JSON.stringify(data, null, '\t');
                                    fs.writeFileSync('./lib/UserData.json', datastr);

                                    await msg.moneyalart(client, Object.keys(data3.russian_roulette.participants)[cnt], reward, '러시안룰렛', 1)

                                    const logmsg = new MessageEmbed()
                                        .setTitle('송금 로그')
                                        .setDescription(`러시안룰렛 님이 ${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name} 님에게 ${reward}원을 송금 했습니다.`)
                                        .setColor('#B545F7')
                                    await msg.log(client, logmsg)

                                    const embed3 = new MessageEmbed()
                                        .setColor('#F5E631')
                                        .setTitle('러시안 룰렛')
                                        .setDescription(`\`${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[oldcnt]].name}\` 님은 사망 했습니다.\n\`${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name}\` 님 만 생존했습니다!\n\n우승자 에게 \`${reward}\`원 의 상금이 지급됩니다!\n\n**👥 참여 인원 [${(Object.keys(data3.russian_roulette.participants).length)}/${num}]**\n${participantsList}`)
                                        .setAuthor({ name: `${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name} 님이 우승했습니다!`, iconURL: (data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].profileimg) })
                                    i.update({ embeds: [embed3], components: [row] });

                                    data3.russian_roulette.is_gaming = false
                                    data3.russian_roulette.participants = {}
                                    datastr = JSON.stringify(data3, null, '\t');
                                    fs.writeFileSync('./lib/Game.json', datastr)
                                }
                                else
                                {
                                    const row2 = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('bang')
                                            .setStyle('SECONDARY')
                                            .setEmoji('🔫')
                                        );

                                    const embed3 = new MessageEmbed()
                                        .setColor('#F54C43')
                                        .setTitle('러시안 룰렛')
                                        .setDescription(`\`${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[oldcnt]].name}\` 님은 사망 했습니다.\n다음은 \`${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name}\` 님의 차례입니다.\n\n**👥 참여 인원 [${(Object.keys(data3.russian_roulette.participants).length)}/${num}]**\n${participantsList}`)
                                        .setAuthor({ name: `🔫 ${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name} 님의 차례 입니다.`, iconURL: (data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].profileimg) })
                                    i.update({ embeds: [embed3], components: [row2] });
                                }
                            }
                            else
                            {   
                                //생존
                                
                                const oldcnt = cnt
                                cnt += 1
                                if(cnt > (num - 1))
                                {
                                    cnt = 0
                                }
                                while((data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].state))
                                {
                                    if(cnt > (num - 1))
                                    {
                                        cnt = 0
                                    }
                                    else
                                    {
                                        cnt += 1
                                    }
                                }
                                
                                const row2 = new MessageActionRow()
                                    .addComponents(
                                        new MessageButton()
                                            .setCustomId('bang')
                                            .setStyle('SECONDARY')
                                            .setEmoji('🔫')
                                    );

                                const embed3 = new MessageEmbed()
                                    .setColor('#23FA60')
                                    .setTitle('러시안 룰렛')
                                    .setDescription(`\`${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[oldcnt]].name}\` 님은 생존했습니다.\n다음은 \`${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name}\` 님의 차례입니다.\n\n**👥 참여 인원 [${(Object.keys(data3.russian_roulette.participants).length)}/${num}]**\n${participantsList}`)
                                    .setAuthor({ name: `🔫 ${data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].name} 님의 차례 입니다.`, iconURL: (data3.russian_roulette.participants[Object.keys(data3.russian_roulette.participants)[cnt]].profileimg) })
                                i.update({ embeds: [embed3], components: [row2] });
                            }
                        }
                        else
                        {
                            i.reply({ content: '당신의 차례가 아닙니다.', ephemeral: true });
                        }
                    }
                });
            }
            else
            {
                interaction.reply({ content: '잔액이 부족합니다.', ephemeral: true });
            }
        }
        else
        {
            interaction.reply({ content: '이미 게임이 진행중 입니다.', ephemeral: true });
        }
    }
}