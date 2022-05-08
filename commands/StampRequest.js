const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs')
const msg = require('../Functions/msg.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('인증도장-신청')
		.setDescription('인증도장을 신청 합니다. 이미지를 올린후 호출해 주세요')
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
            jsonBuffer = fs.readFileSync('./lib/Data.json')
            dataJson = jsonBuffer.toString();
            data = JSON.parse(dataJson);
        }

        var img = []
        await interaction.channel.messages.fetch({ limit: 1 }).then(messages => {
            messages.forEach(element => {
                var Attachment = (element.attachments)
                if (Attachment){
                    Attachment.forEach(att => {
                        img.push(att.url)
                    })
                }
            });
        })
        if(!(img.length > 1) && img.length != 0)
        {
            //Settings.json 파일 불러오기
            jsonBuffer = fs.readFileSync('./lib/Settings.json')
            dataJson = jsonBuffer.toString();
            const data2 = JSON.parse(dataJson);
            //UserData에서 돈 이동
            data.Users[interaction.user.id].NormalAccount -= data2.stamp_price
            const datastr = JSON.stringify(data, null, '\t'); 
            fs.writeFileSync('./lib/UserData.json', datastr); 

            msg.moneyalart(client, interaction.user.id, data2.stamp_price, "인증 도장", 0)

            const attatchment = new MessageAttachment(img[0])
            const logmsg = new MessageEmbed()
                .setTitle('새로운 인증도장 신청')
                .setDescription(`요청 - \`${interaction.user.username}#${interaction.user.discriminator}\` 님`)
                .setColor('#B545F7')
            const channel = interaction.guild.channels.cache.get(data2.stamp_channel)
            channel.send({ embeds : [logmsg], files: [attatchment] })

            
            const embed2 = new MessageEmbed()
                .setTitle('신청 성공 ✅')
                .setDescription(`신청 비용 ${data2.stamp_price}원 이 자동으로 청구 되었습니다.`)
                .setThumbnail(img[0])
                .setColor('#20E86A')
            await interaction.reply({ embeds: [embed2] })
        }
        else
        {
            interaction.reply({ content: '1개 이상의 이미지가 감지 되었거나 이미지를 찾지 못했습니다', ephemeral: true });
        }
    }
}