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
                    .setTitle('μκΈ μλ¦Ό π')
                    .setDescription(`${name} λμ΄ ${value}μ μ μκΈνμ΅λλ€`)
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
                    .setTitle('μΆκΈ μλ¦Ό π')
                    .setDescription(`${name} λμ΄ ${value}μ μ μΆκΈνμ΅λλ€`)
                    .setColor('#FC5E5B')
                targetuser.send({ embeds: [embed3] })
            }
            catch{
    
            }
        }
    }
}