const { MessageEmbed } = require('discord.js')
const {channel} = require('../lib/Settings.json')

module.exports = {
    async log(client, msg) {
        const logchannell = client.channels.cache.get(channel.logchannel)
        logchannell.send({ embeds: [msg] })
    },
    async moneyalart(client, targetId, value, name, state)
    {
        if(state)
        {
            const targetuser = client.users.cache.get(targetId)
            try{
                const embed3 = new MessageEmbed()
                    .setTitle('입금 알림 🔔')
                    .setDescription(`${name} 님이 ${value}원 을 입금했습니다`)
                    .setColor('#20E86A')
                targetuser.send({ embeds: [embed3] })
            }
            catch{
    
            }
        }
        else
        {
            const targetuser = client.users.cache.get(targetId)
            try{
                const embed3 = new MessageEmbed()
                    .setTitle('출금 알림 🔔')
                    .setDescription(`${name} 님이 ${value}원 을 출금했습니다`)
                    .setColor('#FC5E5B')
                targetuser.send({ embeds: [embed3] })
            }
            catch{
    
            }
        }
    }
}