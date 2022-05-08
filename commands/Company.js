const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs')
const msg = require('../Functions/msg.js')

module.exports = {

	data: new SlashCommandBuilder()
		.setName('회사')
		.setDescription('회사를 상장/수정/폐지 합니다')
        
        .addSubcommand(subcommand =>
            subcommand
                .setName('상장')
                .setDescription('회사를 상장 합니다')
                .addStringOption(option => option.setName('이름').setDescription('새로 상장할 회사의 이름').setRequired(true))
                .addNumberOption(option => option.setName('초기-주가').setDescription('새로 상장할 회사의 초기 주가').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('수정')
                .setDescription('회사를 수정 합니다')
                .addStringOption(option => option.setName('수정-전-이름').setDescription('수정 전 회사의 이름').setRequired(true))
                .addStringOption(option => option.setName('수정-후-이름').setDescription('수정 후 회사의 이름').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('폐지')
                .setDescription('회사를 폐지 합니다')
                .addStringOption(option => option.setName('이름').setDescription('폐지할 회사의 이름').setRequired(true)))
        .setDefaultPermission(false),

	async execute(interaction, client) {
        //Companys.json 파일 불러오기
        const jsonBuffer = fs.readFileSync('./lib/Companys.json')
        const dataJson = jsonBuffer.toString();
        const data = JSON.parse(dataJson);
        switch(interaction.options._subcommand)
        {
            case "상장":
                //회사 추가
                try
                {
                    const companyname = interaction.options._hoistedOptions[0].value
                    data.Companys[companyname] = {
                        price : interaction.options._hoistedOptions[1].value,
                        price_history : {

                        }
                    }
                    const datastr = JSON.stringify(data, null, '\t');
                    fs.writeFileSync('./lib/Companys.json', datastr);

                    const logmsg = new MessageEmbed()
                        .setTitle('새로운 회사 상장 되었습니다.')
                        .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${companyname} 회사를 상장 했습니다.`)
                        .setColor('#B545F7')
                    await msg.log(client, logmsg)

                    const embed = new MessageEmbed()
                        .setTitle('회사 상장 성공 ✅')
                        .setDescription(`${companyname} 회사가 상장 되었습니다! 🎉`)
                        .setColor('#315CE8')
                    await interaction.reply({ embeds: [embed] })
                }
                catch
                {
                    //명령 실패
                    const embed = new MessageEmbed()
                        .setTitle('상장 실패 ❌')
                        .addField('사유', '회사 이름과 초기 주가를 입력해 주세요')
                        .setColor('#FC5E5B')
                    await interaction.reply({ embeds: [embed] })
                }
                return 0

            case "수정":
                //회사 이름 수정
                try
                {
                    const excompanyname = interaction.options._hoistedOptions[0].value
                    const nwcompanyname = interaction.options._hoistedOptions[1].value

                    if(excompanyname in data.Companys)
                    {
                        data.Companys[nwcompanyname] = {
                            price : data.Companys[excompanyname].price
                        }
                        delete data.Companys[excompanyname]
                        const datastr = JSON.stringify(data, null, '\t');
                        fs.writeFileSync('./lib/Companys.json', datastr);

                        const logmsg = new MessageEmbed()
                            .setTitle('회사 이름이 수정 되었습니다.')
                            .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${excompanyname} 회사의 이름을 ${nwcompanyname} (으)로 수정 했습니다.`)
                            .setColor('#B545F7')
                        await msg.log(client, logmsg)

                        const embed = new MessageEmbed()
                            .setTitle('회사 수정 성공 ✅')
                            .setDescription(`${excompanyname} 회사의 이름이 ${nwcompanyname} (으)로 변경 되었습니다! 🎉`)
                            .setColor('#315CE8')
                        await interaction.reply({ embeds: [embed] })
                    }
                    else
                    {
                        const embed = new MessageEmbed()
                            .setTitle('수정 실패 ❌')
                            .addField('사유', '존재하지 않는 회사 입니다')
                            .setColor('#FC5E5B')
                        await interaction.reply({ embeds: [embed] })
                    }
                }
                catch
                {
                    //명령 실패
                    const embed = new MessageEmbed()
                        .setTitle('수정 실패 ❌')
                        .addField('사유', '수정전 이름과 수정후 이름을 입력해 주세요')
                        .setColor('#FC5E5B')
                    await interaction.reply({ embeds: [embed] })
                }
                return 0
                
            case "폐지":
                //회사 삭제
                try
                {
                    const companyname = interaction.options._hoistedOptions[0].value

                    if(companyname in data.Companys)
                    {
                        delete data.Companys[companyname]
                        const datastr = JSON.stringify(data, null, '\t');
                        fs.writeFileSync('./lib/Companys.json', datastr);

                        const logmsg = new MessageEmbed()
                            .setTitle('회사가 폐지 되었습니다.')
                            .setDescription(`${interaction.user.username}#${interaction.user.discriminator} 님이 ${companyname} 회사를 폐지 했습니다.`)
                            .setColor('#B545F7')
                        await msg.log(client, logmsg)

                        const embed = new MessageEmbed()
                            .setTitle('회사 폐지 성공 ✅')
                            .setDescription(`${companyname} 회사가 폐지 되었습니다`)
                            .setColor('#315CE8')
                        await interaction.reply({ embeds: [embed] })
                    }
                    else
                    {
                        const embed = new MessageEmbed()
                            .setTitle('폐지 실패 ❌')
                            .addField('사유', '존재하지 않는 회사 입니다')
                            .setColor('#FC5E5B')
                        await interaction.reply({ embeds: [embed] })
                    }
                }
                catch
                {
                    //명령 실패
                    const embed = new MessageEmbed()
                        .setTitle('폐지 실패 ❌')
                        .addField('사유', '이름을 입력해 주세요')
                        .setColor('#FC5E5B')
                    await interaction.reply({ embeds: [embed] })
                }
                return 0
        }
    }
}