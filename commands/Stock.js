const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const fs = require('fs')
const lop = require('../Functions/loop.js')
const join = require('../Functions/Newbie.js')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

module.exports = {

	data: new SlashCommandBuilder()
		.setName('주식')
		.setDescription('주식 관련 명령어')
        .setDefaultPermission(true)
        .addSubcommand(subcommand =>
            subcommand
                .setName('차트')
                .setDescription('주식 차트를 조회합니다.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('그래프')
                .setDescription('특정 회사의 주가 변동 그래프를 조회합니다')
                .addStringOption(option => option.setName('이름').setDescription('조회할 회사의 이름').setRequired(true)))
        ,

	async execute(interaction) {
        //UserData.json 파일 불러오기
        var jsonBuffer = fs.readFileSync('./lib/UserData.json')
        var dataJson = jsonBuffer.toString();
        var data = JSON.parse(dataJson);
        if(!interaction.user.id in data.Users)
        {  
            //가입 되어 있지 않다면 가입
            await join.CreateNewUserData(interaction.user.id, client)
            //Data.json 파일 다시 불러오기
            jsonBuffer = fs.readFileSync('./lib/UserData.json')
            dataJson = jsonBuffer.toString();
            data = JSON.parse(dataJson);
        }
            
        //Companys.json 파일 불러오기
        jsonBuffer = fs.readFileSync('./lib/Companys.json')
        dataJson = jsonBuffer.toString();
        const data2 = JSON.parse(dataJson);
        switch(interaction.options._subcommand)
        {
            case "차트":

                function minTwoDigits(n) {
                    return (n < 10 ? '0' : '') + n;
                }

                const date = new Date()
                const dayinfo = `📈 \`${date.getFullYear()}/${minTwoDigits((date.getMonth() + 1))}/${minTwoDigits(date.getDate())} ${minTwoDigits(date.getHours())}:${minTwoDigits(date.getMinutes())}\` 주식 정보\n`
                var message = dayinfo
                message += '```diff'
                for(const company of Object.keys(data2.Companys))
                {
                    //변동폭이 "-"인경우
                    if(data2.Companys[company].price < data2.Companys[company].price_history[1].price)
                    {
                        message += `\n- ${company}\t${data2.Companys[company].price} (▼ ${data2.Companys[company].price_history[1].price - data2.Companys[company].price})`
                    }
                    //변동폭이 "+"인경우
                    else if(data2.Companys[company].price > data2.Companys[company].price_history[1].price)
                    {
                        message += `\n+ ${company}\t${data2.Companys[company].price} (▲ ${data2.Companys[company].price - data2.Companys[company].price_history[1].price})`
                    }
                    //변동폭이 없는경우
                    else
                    {
                        message += `\n● ${company}\t${data2.Companys[company].price} (- 0)`
                    }
                }
                message += '\n```'
                message += `\`다음 변동 - ${await lop.stocktimeleft()}초 후\``
                await interaction.reply(message);
                return 0
            case "그래프":
                interaction.reply({ content: `잠시만 기다려 주세요.`, ephemeral: true })
                const companyname = interaction.options._hoistedOptions[0].value

                //회사가 존재하는지 조회
                if(companyname in data2.Companys)
                {
                    //DB 불러와서 저장하기
                    const pricedata = []
                    
                    for(const item of data2.Companys[companyname].price_history)
                    {
                        const tmp = {
                            x : item.time,
                            y : item.price
                        }
                        pricedata.unshift(tmp)
                    }

                    //주식 그래프 이미지 만들기
                    const width = 800; //px
                    const height = 600; //px
                    const backgroundColour = 'white';
                    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour});
                    
                    const configuration = {
                        type : 'line',
                        data : {
                            datasets: [{
                                label: `${companyname}`,
                                data: pricedata,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1
                            }]
                        }
                    };
                    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
                    const attatchment = new MessageAttachment(image)
                    await interaction.channel.send({files: [attatchment]})
                }
                else
                {
                    const embed = new MessageEmbed()
                        .setTitle('조회 실패 ❌')
                        .addField('사유', '존재하지 않는 회사 입니다')
                        .setColor('#FC5E5B')
                    await interaction.channel.send({ embeds: [embed] })
                }
                return 0
        }
    }
}