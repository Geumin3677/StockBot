const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const msg = require('../Functions/msg.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('설정')
		.setDescription('설정')
        .setDefaultPermission(false)
        .addSubcommand(subcommand =>
            subcommand
                .setName('로그채널등록')
                .setDescription('로그 채널을 등록 합니다')
                .addChannelOption(option => option.setName('채널').setDescription('등록할 채널').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('글작성채널등록')
                .setDescription('글 작성 채널을 등록 합니다')
                .addChannelOption(option => option.setName('채널').setDescription('등록할 채널').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('세율설정')
                .setDescription('세율을 설정 합니다')
                .addNumberOption(option => option.setName('세율').setDescription('설정할 세율').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('등락률설정')
                .setDescription('주가 등락률을 설정 합니다')
                .addNumberOption(option => option.setName('등락률').setDescription('설정할 등락률').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('글작성채널-보상설정')
                .setDescription('글작성 채널의 보상을 설정 합니다')
                .addNumberOption(option => option.setName('금액').setDescription('보상할 금액').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('갱신시간설정')
                .setDescription('주가 갱신 시간을 설정 합니다')
                .addNumberOption(option => option.setName('초').setDescription('주가를 갱신할 시간').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('게임채널등록')
                .setDescription('각 게임의 채널을 등록 합니다')
                .addStringOption(option =>
                    option.setName('게임종류')
                        .setDescription('채널을 등록할 게임')
                        .addChoice('동전던지기', 'coin')
                        .addChoice('러시안룰렛', 'roulette')
                        .addChoice('경마', 'racing')
                        .addChoice('슬롯', 'slot')
                        .setRequired(true))
                .addChannelOption(option => option.setName('채널').setDescription('등록할 채널').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('코인스테이킹-대상설정')
                .setDescription('코인스테이킹 대상을 설정 합니다.')
                .addRoleOption(option => option.setName('대상').setDescription('코인 스테이킹 대상')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('코인스테이킹-금액설정')
                .setDescription('코인스테이킹 금액을 설정 합니다.')
                .addNumberOption(option => option.setName('금액').setDescription('코인 스테이킹 금액')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('코인스테이킹-시간설정')
                .setDescription('코인스테이킹 시간을 설정 합니다.')
                .addNumberOption(option => option.setName('시간').setDescription('코인 스테이킹 시간')))
        .addSubcommand(subcommand =>
            subcommand
                .setName('경마상금설정')
                .setDescription('세율을 설정 합니다')
                .addNumberOption(option => option.setName('1등').setDescription('1등에게 지급할 상금의 비율').setRequired(true))
                .addNumberOption(option => option.setName('2등').setDescription('1등에게 지급할 상금의 비율').setRequired(true))
                .addNumberOption(option => option.setName('3등').setDescription('1등에게 지급할 상금의 비율').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('경마인원설정')
                .setDescription('경마 인원을 설정 합니다')
                .addNumberOption(option => option.setName('인원').setDescription('경마 인원').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('인증도장-채널등록')
                .setDescription('인증도장(관리자) 채널을 등록 합니다')
                .addChannelOption(option => option.setName('채널').setDescription('등록할 채널').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('인증도장-가격설정')
                .setDescription('인증도장 가격을 설정 합니다')
                .addNumberOption(option => option.setName('가격').setDescription('인증도장 가격').setRequired(true))),

	async execute(interaction, client) {
        //Settings.json 파일 불러오기
        const jsonBuffer = fs.readFileSync('./lib/Settings.json')
        const dataJson = jsonBuffer.toString();
        const data = JSON.parse(dataJson);
        switch(interaction.options._subcommand)
        {
            case "로그채널등록":
                try{  
                    const channel = interaction.options._hoistedOptions[0].channel

                    data.channel.logchannel = channel.id

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 로그채널이 등록 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[0].channel} 채널을 로그 채널로 등록했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('로그채널 등록 성공 ✅')
                        .setDescription(`${interaction.options._hoistedOptions[0].channel} 채널을 로그 채널로 등록했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch(error){
                    console.log(error)
                }
                return 0
            case "글작성채널등록":
                try{  
                    const channel = interaction.options._hoistedOptions[0].channel

                    data.channel.writing = channel.id

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 글 작성 채널이 등록 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[0].channel} 채널을 글 작성 채널로 등록했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('글 작성 채널 등록 성공 ✅')
                        .setDescription(`${interaction.options._hoistedOptions[0].channel} 채널을 글 작성 채널로 등록했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch(error){
                    console.log(error)
                }
                return 0
            case "세율설정":
                try{ 
                    data.t = interaction.options._hoistedOptions[0].value

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 세율이 설정 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 세율을 ${interaction.options._hoistedOptions[0].value}% 로 설정했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('세율 설정 성공 ✅')
                        .setDescription(`세율을 ${interaction.options._hoistedOptions[0].value} 로 설정했습니다`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch(error){
                    console.log(error)
                }
                return 0
            case "글작성채널-보상설정":
                try{ 
                    data.writingReward = interaction.options._hoistedOptions[0].value

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 글작성 채널 보상이 설정 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 글작성 채널 보상을 ${interaction.options._hoistedOptions[0].value}% 로 설정했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('글작성 채널 보상 설정 성공 ✅')
                        .setDescription(`글작성 채널 보상을 ${interaction.options._hoistedOptions[0].value} 로 설정했습니다`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch(error){
                    console.log(error)
                }
                return 0
            case "등락률설정":
                try{
                    data.stock_per = interaction.options._hoistedOptions[0].value

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 등락률이 설정 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 등락률을 ${interaction.options._hoistedOptions[0].value}% 로 설정했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('등락률 설정 성공 ✅')
                        .setDescription(`등락률을 ${interaction.options._hoistedOptions[0].value} 로 설정했습니다`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch(error){
                    console.log(error)
                }
                return 0
            case "갱신시간설정":
                try{
                    data.stock_time = interaction.options._hoistedOptions[0].value

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 주가 갱신 시간이 설정 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 주가 생신 시간을 ${interaction.options._hoistedOptions[0].value}초 로 설정했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('주가 갱신 시간 설정 성공 ✅')
                        .setDescription(`주가 갱신 시간을 ${interaction.options._hoistedOptions[0].value} 로 설정했습니다`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch{

                }
                return 0
            case "게임채널등록":
                var choice = interaction.options._hoistedOptions[0].value
                var channel = interaction.options._hoistedOptions[1].channel
                switch(choice)
                {
                    case "coin":
                        try{
                            data.channel.coin = channel.id
                            const datastr = JSON.stringify(data, null, '\t');
                            fs.writeFileSync('./lib/Settings.json', datastr);

                            const logmsg = new MessageEmbed()
                                .setTitle('새로운 동전던지기 채널이 등록 되었습니다.✅')
                                .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[1].channel} 채널을 동전던지기 채널로 등록했습니다.`)
                                .setColor('#B545F7')
                            await msg.log(client, logmsg)

                            const embed = new MessageEmbed()
                                .setTitle('동전던지기 채널 등록 성공 ✅')
                                .setDescription(`${interaction.options._hoistedOptions[1].channel} 채널을 동전던지기 채널로 등록했습니다.`)
                                .setColor('#315CE8')
                            await interaction.reply({ embeds: [embed] })
                        }
                        catch(error){
                            console.log(error)
                        }
                        return 0
                    case "roulette":
                        try{
                            data.channel.roulette = channel.id
                            const datastr = JSON.stringify(data, null, '\t');
                            fs.writeFileSync('./lib/Settings.json', datastr);

                            const logmsg = new MessageEmbed()
                                .setTitle('새로운 러시안룰렛 채널이 등록 되었습니다.✅')
                                .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[1].channel} 채널을 러시안룰렛 채널로 등록했습니다.`)
                                .setColor('#B545F7')
                            await msg.log(client, logmsg)

                            const embed = new MessageEmbed()
                                .setTitle('러시안룰렛 채널 등록 성공 ✅')
                                .setDescription(`${interaction.options._hoistedOptions[1].channel} 채널을 러시안룰렛 채널로 등록했습니다.`)
                                .setColor('#315CE8')
                            await interaction.reply({ embeds: [embed] })
                        }
                        catch(error){
                            console.log(error)
                        }
                        return 0
                    case "slot":
                        try{
                            data.channel.slot = channel.id
                            const datastr = JSON.stringify(data, null, '\t');
                            fs.writeFileSync('./lib/Settings.json', datastr);

                            const logmsg = new MessageEmbed()
                                .setTitle('새로운 슬롯 채널이 등록 되었습니다.✅')
                                .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[1].channel} 채널을 슬롯 채널로 등록했습니다.`)
                                .setColor('#B545F7')
                            await msg.log(client, logmsg)

                            const embed = new MessageEmbed()
                                .setTitle('슬롯 채널 등록 성공 ✅')
                                .setDescription(`${interaction.options._hoistedOptions[1].channel} 채널을 슬롯 채널로 등록했습니다.`)
                                .setColor('#315CE8')
                            await interaction.reply({ embeds: [embed] })
                        }
                        catch(error){
                            console.log(error)
                        }
                        return 0
                    case "racing":
                        try{
                            data.channel.racing = channel.id
                            const datastr = JSON.stringify(data, null, '\t');
                            fs.writeFileSync('./lib/Settings.json', datastr);

                            const logmsg = new MessageEmbed()
                                .setTitle('새로운 경마 채널이 등록 되었습니다.✅')
                                .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[1].channel} 채널을 경마 채널로 등록했습니다.`)
                                .setColor('#B545F7')
                            await msg.log(client, logmsg)

                            const embed = new MessageEmbed()
                                .setTitle('경마 채널 등록 성공 ✅')
                                .setDescription(`${interaction.options._hoistedOptions[1].channel} 채널을 경마 채널로 등록했습니다.`)
                                .setColor('#315CE8')
                            await interaction.reply({ embeds: [embed] })
                        }
                        catch(error){
                            console.log(error)
                        }
                        return 0
                }
                return 0
            case "코인스테이킹-대상설정":
                try{
                    const roleid = interaction.options._hoistedOptions[0].value
                    data.coin_staking = roleid
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 코인스테이킹 대상이 등록 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[0].role} 을 코인스테이킹 대상으로 등록했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('코인스테이킹 대상 등록 성공 ✅')
                        .setDescription(`${interaction.options._hoistedOptions[0].role} 을 코인스테이킹 대상으로 등록했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch{

                }
                return 0
            case "코인스테이킹-금액설정":
                try{
                    const value = interaction.options._hoistedOptions[0].value
                    data.staking_value = value
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 코인스테이킹 금액이 등록 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[0].value}원 을 코인스테이킹 금액으로 등록했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('코인스테이킹 대상 등록 성공 ✅')
                        .setDescription(`${interaction.options._hoistedOptions[0].value}원 을 코인스테이킹 금액으로 등록했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch{

                }
                return 0
            case "코인스테이킹-시간설정":
                try{
                    const value = interaction.options._hoistedOptions[0].value
                    data.staking_time = value
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 코인스테이킹 시간이 등록 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[0].value}시간 을 코인스테이킹 시간으로 등록했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('코인스테이킹 대상 등록 성공 ✅')
                        .setDescription(`${interaction.options._hoistedOptions[0].value}시간 을 코인스테이킹 시간으로 등록했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch{

                }
                return 0
            case "경마상금설정":
                try{
                    data.horse_per.st = interaction.options._hoistedOptions[0].value
                    data.horse_per.nd = interaction.options._hoistedOptions[1].value
                    data.horse_per.th = interaction.options._hoistedOptions[2].value

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 경마 상금 지급비율이 설정 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 경마 상금 지급비율을 1등 - ${interaction.options._hoistedOptions[0].value}%  2등 - ${interaction.options._hoistedOptions[1].value}  3등 - ${interaction.options._hoistedOptions[2].value} 으로 설정했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('경마 상금 지급비율 등록 성공 ✅')
                        .setDescription(`경마 상금 지급비율을 1등 - ${interaction.options._hoistedOptions[0].value}%  2등 - ${interaction.options._hoistedOptions[1].value}  3등 - ${interaction.options._hoistedOptions[2].value} 으로 설정했습니다.ㅁ`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch{

                }
                return 0
            case "경마인원설정":
                try{
                    data.horse = interaction.options._hoistedOptions[0].value

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 경마 상금 지급비율이 설정 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 경마 인원을 ${interaction.options._hoistedOptions[0].value} 명 으로 설정했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('경마 상금 지급비율 등록 성공 ✅')
                        .setDescription(`경마 인원을 ${interaction.options._hoistedOptions[0].value} 명 으로 설정했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch{

                }
                return 0
            case "인증도장-채널등록":
                try{  
                    const channel = interaction.options._hoistedOptions[0].channel

                    data.channel.stamp_channel = channel.id

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 인증도장 채널이 등록 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${interaction.options._hoistedOptions[0].channel} 채널을 인증도장  채널로 등록했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('인증도장 채널 등록 성공 ✅')
                        .setDescription(`${interaction.options._hoistedOptions[0].channel} 채널을 인증도장 채널로 등록했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch(error){
                    console.log(error)
                }
                return 0
            case "인증도장-가격설정":
                try {
                    const value = interaction.options._hoistedOptions[0].value
                    data.stamp_price = value

                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Settings.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 인증도장 가격이 설정 되었습니다.✅')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 인증도장 가격을 ${interaction.options._hoistedOptions[0].value} 원 으로 설정했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('인증도장 가격 등록 성공 ✅')
                        .setDescription(`인증도장 가격을 ${interaction.options._hoistedOptions[0].value} 원 으로 설정했습니다.`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch {

                }
                return 0 
        }
    }
}