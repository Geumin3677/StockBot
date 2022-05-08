const { MessageEmbed } = require('discord.js')
const msge = require('../Functions/msg.js');
const fs = require('fs')

let emoji = ['💯', '🥇', '💎', '💵', '💰']

module.exports = {
    async slott(msg, batting, interaction, client) {

        //룰렛 돌리기
        let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

        var res1 = makeRandom(0, 4)
        const embed1 = new MessageEmbed()
            .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 슬롯`)
            .setDescription(`**------------------------------------
            |◾${emoji[res1]}◾|◾❓◾|◾❓◾|
            ------------------------------------
            ----------- SPINNING -----------**`)
            .setColor('#20E86A')
        await msg.edit({ embeds: [embed1] })
        await sleep(700)

        var res2 = makeRandom(0, 4)
        const embed2 = new MessageEmbed()
            .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 슬롯`)
            .setDescription(`**------------------------------------
            |◾${emoji[res1]}◾|◾${emoji[res2]}◾|◾❓◾|
            ------------------------------------
            ----------- SPINNING -----------**`)
            .setColor('#20E86A')
        await msg.edit({ embeds: [embed2] })
        await sleep(700)

        var res3 = makeRandom(0, 4)
        const embed3 = new MessageEmbed()
            .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 슬롯`)
            .setDescription(`**------------------------------------
            |◾${emoji[res1]}◾|◾${emoji[res2]}◾|◾${emoji[res3]}◾|
            ------------------------------------
            ----------- SPINNING -----------**`)
            .setColor('#20E86A')
        await msg.edit({ embeds: [embed3] })

        console.log(`${res1} ${res2} ${res3}`)

        var res = 0
        //결과 계산
        //똑같은거 2개 연속
        if(res1 === res2 || res2 === res3)
        {
            switch(res2)
            {
                case 1:
                    res = 0.5
                    break;
                case 2:
                    res = 2
                    break;
                case 0:
                    res = 2
                    break;
                case 3:
                    res = 3.5
                    break;
                case 4:
                    res = 7
                    break;
            }
        }

        if(res1 === res2 === res3)
        {
            console.log('asdf')
            switch(res2)
            {
                case 1:
                    res = 2.5
                    break;
                case 2:
                    res = 3
                    break;
                case 0:
                    res = 4
                    break;
                case 3:
                    res = 7
                    break;
                case 4:
                    res = 15
                    break;
            }
        }
        
        console.log(res)

        //결과 산출

        //UserData.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/UserData.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);

        //Settings.json 파일 불러오기
        jsonBuffer = fs.readFileSync('./lib/Settings.json')
        dataJson = jsonBuffer.toString();
        var data2 = JSON.parse(dataJson);
        t = data2.t

        if(res <= 1)
        {
            //예상 실패
            data.Users[interaction.user.id].NormalAccount -= batting
            const datastr = JSON.stringify(data, null, '\t');
            fs.writeFileSync('./lib/UserData.json', datastr);

            await msge.moneyalart(client, interaction.user.id, batting, '슬롯', 0)

            const logmsg = new MessageEmbed()
                .setTitle('출금 로그')
                .setDescription(`슬롯 님이 ${interaction.user.username}#${interaction.user.discriminator} 님에게 ${batting}원을 출금 했습니다.`)
                .setColor('#B545F7')
            await msge.log(client, logmsg)

            const profit = -(batting - (batting * res))
            const result = new MessageEmbed()
                .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 슬롯`)
                .setDescription(`**------------------------------------
                |◾${emoji[res1]}◾|◾${emoji[res2]}◾|◾${emoji[res3]}◾|
                ------------------------------------
                ----------- YOU LOST -----------**`)
                .addField('이익', `${profit}원`)
                .setColor('#FC5E5B')
            await msg.edit({ embeds: [result] })
        }
        else
        {
            //송금
            data.Users[interaction.user.id].NormalAccount += batting + (batting - (batting * t))
            const datastr = JSON.stringify(data, null, '\t');
            fs.writeFileSync('./lib/UserData.json', datastr);

            await msge.moneyalart(client, interaction.user.id, (batting + (batting - (batting * t))), '슬롯', 1)

            const logmsg = new MessageEmbed()
                .setTitle('송금 로그')
                .setDescription(`슬롯 님이 ${interaction.user.username}#${interaction.user.discriminator} 님에게 ${(batting + (batting - (batting * t)))}원을 송금 했습니다.`)
                .setColor('#B545F7')
            await msge.log(client, logmsg)

            const profit = (batting * res)
            const result = new MessageEmbed()
                .setTitle(`${interaction.user.username}#${interaction.user.discriminator} 님의 슬롯`)
                .setDescription(`**------------------------------------
                |◾${emoji[res1]}◾|◾${emoji[res2]}◾|◾${emoji[res3]}◾|
                ------------------------------------
                ----------- YOU WIN -----------**`)
                .addField('이익', `${profit}원`)
                .setColor('#20E86A')
            await msg.edit({ embeds: [result] })
        }
    }
}

function makeRandom(min, max){
    var RandVal = Math.floor(Math.random()*(max-min+1)) + min;
    return RandVal;
}